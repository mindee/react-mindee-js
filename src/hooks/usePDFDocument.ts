import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  openPDF,
  type PDFDocumentHandle,
  type PDFPageOptions,
  type PDFSource,
} from '@/utils/pdf';

export type UsePDFDocumentOptions = {
  /** Pages rendered as soon as the document opens. Defaults to 5. */
  prefetch?: number;
  /** Pages rendered together when one of them is requested. Defaults to 3. */
  batch?: number;
  /** Rendering resolution in pixels, see `PDFPageOptions.resolution`. */
  resolution?: number;
  /** Rejects documents with more pages, see `OpenPDFOptions.maxPages`. */
  maxPages?: number;
};

export type UsePDFDocumentStatus = 'idle' | 'opening' | 'ready' | 'error';

export type UsePDFDocumentResult = {
  status: UsePDFDocumentStatus;
  error: Error | null;
  numPages: number;
  /**
   * One slot per page, indexed from 0. A slot is `undefined` until the page
   * has been rendered, then holds an image URL usable as `data.image`.
   */
  pages: (string | undefined)[];
  /** Pages (0-based indexes) whose render is queued or in progress. */
  loading: ReadonlySet<number>;
  /**
   * Ensures the page at `index` (0-based) and the rest of its batch are
   * rendered. Safe to call repeatedly: already rendered pages are skipped and
   * a page still waiting in the queue is promoted. The page itself is
   * requested with high priority so it is drawn before any pending prefetch.
   */
  loadPage: (index: number) => void;
  /** Renders every page in `[from, to)` (0-based, `to` exclusive). */
  loadRange: (from: number, to: number) => void;
  /** Underlying handle for advanced use, `null` until `status` is `ready`. */
  document: PDFDocumentHandle | null;
};

const DEFAULT_PREFETCH = 5;
const DEFAULT_BATCH = 3;

const EMPTY_SET: ReadonlySet<number> = new Set();

type State = {
  source: PDFSource | null | undefined;
  maxPages: number | undefined;
  status: UsePDFDocumentStatus;
  error: Error | null;
  document: PDFDocumentHandle | null;
  pages: (string | undefined)[];
  loading: ReadonlySet<number>;
};

const initialState = (
  source: PDFSource | null | undefined,
  maxPages: number | undefined,
): State => ({
  source,
  maxPages,
  status: source === null || source === undefined ? 'idle' : 'opening',
  error: null,
  document: null,
  pages: [],
  loading: EMPTY_SET,
});

const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

/**
 * Boundaries of the batch containing `index`: the first `prefetch` pages form
 * one block, the remaining pages are grouped `batch` at a time after it.
 */
const batchBounds = (
  index: number,
  numPages: number,
  prefetch: number,
  batch: number,
): [number, number] => {
  if (index < prefetch) {
    return [0, Math.min(prefetch, numPages)];
  }
  const from = prefetch + Math.floor((index - prefetch) / batch) * batch;
  return [from, Math.min(from + batch, numPages)];
};

/**
 * Opens a PDF and renders its pages progressively: the first `prefetch`
 * pages right away, then `batch` pages at a time whenever `loadPage` is
 * called for a page that is not rendered yet. The document is destroyed
 * (and its object URLs revoked) when `source` changes or on unmount.
 *
 * @example
 * const { pages, numPages, loadPage } = usePDFDocument(file);
 * <AnnotationViewer data={{ image: pages[current] }} />
 * // when the user scrolls page `index` into view:
 * loadPage(index);
 */
export const usePDFDocument = (
  source: PDFSource | null | undefined,
  options: UsePDFDocumentOptions = {},
): UsePDFDocumentResult => {
  const {
    prefetch = DEFAULT_PREFETCH,
    batch = DEFAULT_BATCH,
    resolution,
    maxPages,
  } = options;

  const [state, setState] = useState<State>(() =>
    initialState(source, maxPages),
  );
  const requested = useRef(new Set<number>());

  if (state.source !== source || state.maxPages !== maxPages) {
    setState(initialState(source, maxPages));
  }

  useEffect(() => {
    requested.current = new Set();
    if (source === null || source === undefined) {
      return undefined;
    }

    let handle: PDFDocumentHandle | undefined;
    let cancelled = false;
    openPDF(source, { maxPages })
      .then(async (opened) => {
        if (cancelled) {
          await opened.destroy();
          return;
        }
        handle = opened;
        setState((previous) => ({
          ...previous,
          status: 'ready',
          document: opened,
          pages: new Array<string | undefined>(opened.numPages).fill(undefined),
        }));
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setState((previous) => ({
            ...previous,
            status: 'error',
            error: toError(reason),
          }));
        }
      });

    return () => {
      cancelled = true;
      void handle?.destroy();
    };
  }, [source, maxPages]);

  const document = state.document;

  const render = useCallback(
    (index: number, pageOptions: PDFPageOptions) => {
      if (document === null || requested.current.has(index)) {
        return;
      }
      requested.current.add(index);
      setState((previous) => ({
        ...previous,
        loading: new Set(previous.loading).add(index),
      }));
      document
        .getPage(index + 1, { ...pageOptions, resolution })
        .then((image) => {
          setState((previous) => {
            const pages = [...previous.pages];
            pages[index] = image;
            return { ...previous, pages };
          });
        })
        .catch((reason: unknown) => {
          requested.current.delete(index);
          if (toError(reason).name !== 'AbortError') {
            setState((previous) => ({ ...previous, error: toError(reason) }));
          }
        })
        .finally(() => {
          setState((previous) => {
            const loading = new Set(previous.loading);
            loading.delete(index);
            return { ...previous, loading };
          });
        });
    },
    [document, resolution],
  );

  const loadRange = useCallback(
    (from: number, to: number) => {
      if (document === null) {
        return;
      }
      const start = Math.max(0, from);
      const end = Math.min(document.numPages, to);
      for (let index = start; index < end; index += 1) {
        render(index, { priority: 'low' });
      }
    },
    [document, render],
  );

  const loadPage = useCallback(
    (index: number) => {
      if (document === null || index < 0 || index >= document.numPages) {
        return;
      }
      if (requested.current.has(index)) {
        void document
          .getPage(index + 1, { priority: 'high', resolution })
          .catch(() => undefined);
      } else {
        render(index, { priority: 'high' });
      }
      loadRange(...batchBounds(index, document.numPages, prefetch, batch));
    },
    [document, render, loadRange, prefetch, batch, resolution],
  );

  useEffect(() => {
    if (document !== null) {
      loadRange(0, prefetch);
    }
  }, [document, loadRange, prefetch]);

  return useMemo(
    () => ({
      status: state.status,
      error: state.error,
      numPages: document?.numPages ?? 0,
      pages: state.pages,
      loading: state.loading,
      loadPage,
      loadRange,
      document,
    }),
    [state, document, loadPage, loadRange],
  );
};
