import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  openPDF,
  type PDFDocumentHandle,
  type PDFPageOptions,
  type PDFSource,
} from '@/utils/pdf';

export type UsePDFDocumentOptions = {
  /**
   * Pages rendered as soon as the document opens. Defaults to 5. Must be a
   * non-negative integer.
   */
  prefetch?: number;
  /**
   * Pages rendered together when one of them is requested. Defaults to 3.
   * Must be a positive integer.
   */
  batch?: number;
  /**
   * Rendering resolution in pixels, see `PDFPageOptions.resolution`.
   * Re-renders on change.
   */
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
   * One slot per page, indexed from 0.
   */
  pages: (string | undefined)[];
  /** Pages (0-based indexes) whose render is queued or in progress. */
  loading: ReadonlySet<number>;
  /**
   * Renders a batch starting at `index` (0-based).
   */
  loadPage: (index: number) => void;
  /**
   * Renders every page in `[from, to)` (0-based integers, `to` exclusive).
   */
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
  resolution: number | undefined;
  status: UsePDFDocumentStatus;
  error: Error | null;
  document: PDFDocumentHandle | null;
  pages: (string | undefined)[];
  loading: ReadonlySet<number>;
  /** Indexes to render again after a resolution change. */
  reload: ReadonlySet<number>;
};

/**
 * Pages requested so far, tagged with the document and resolution they were
 * requested for.
 */
type Requested = {
  document: PDFDocumentHandle | null;
  resolution: number | undefined;
  indexes: Set<number>;
  controller: AbortController;
};

const nextGeneration = (
  previous: Requested,
  document: PDFDocumentHandle | null,
  resolution: number | undefined,
): Requested => {
  previous.controller.abort();
  return {
    document,
    resolution,
    indexes: new Set(),
    controller: new AbortController(),
  };
};

const initialState = (
  source: PDFSource | null | undefined,
  maxPages: number | undefined,
  resolution: number | undefined,
): State => ({
  source,
  maxPages,
  resolution,
  status: source === null || source === undefined ? 'idle' : 'opening',
  error: null,
  document: null,
  pages: [],
  loading: EMPTY_SET,
  reload: EMPTY_SET,
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

const assertInteger = (name: string, value: number, min: number): void => {
  if (!Number.isInteger(value) || value < min) {
    throw new RangeError(
      `${name} must be an integer >= ${String(min)}, got ${String(value)}`,
    );
  }
};

/**
 * Opens a PDF and renders its pages progressively.
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
  assertInteger('prefetch', prefetch, 0);
  assertInteger('batch', batch, 1);

  const [state, setState] = useState<State>(() =>
    initialState(source, maxPages, resolution),
  );
  const requested = useRef<Requested>({
    document: null,
    resolution,
    indexes: new Set(),
    controller: new AbortController(),
  });

  if (state.source !== source || state.maxPages !== maxPages) {
    setState(initialState(source, maxPages, resolution));
  } else if (state.resolution !== resolution) {
    setState((previous) => {
      const reload = new Set(previous.loading);
      previous.pages.forEach((page, index) => {
        if (page !== undefined) {
          reload.add(index);
        }
      });
      return {
        ...previous,
        resolution,
        pages: new Array<string | undefined>(previous.pages.length).fill(
          undefined,
        ),
        loading: EMPTY_SET,
        reload,
      };
    });
  }

  useEffect(() => {
    if (source === null || source === undefined) {
      return undefined;
    }

    let handle: PDFDocumentHandle | undefined;
    const opening = new AbortController();
    openPDF(source, { maxPages, signal: opening.signal })
      .then(async (opened) => {
        if (opening.signal.aborted) {
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
        if (!opening.signal.aborted) {
          setState((previous) => ({
            ...previous,
            status: 'error',
            error: toError(reason),
          }));
        }
      });

    return () => {
      opening.abort();
      requested.current = nextGeneration(
        requested.current,
        null,
        requested.current.resolution,
      );
      void handle?.destroy();
    };
  }, [source, maxPages]);

  const document = state.document;

  /** Current generation for `document` at `resolution`, started if needed. */
  const generation = useCallback(
    (handle: PDFDocumentHandle): Requested => {
      if (
        requested.current.document !== handle ||
        requested.current.resolution !== resolution
      ) {
        requested.current = nextGeneration(
          requested.current,
          handle,
          resolution,
        );
      }
      return requested.current;
    },
    [resolution],
  );

  const render = useCallback(
    (index: number, pageOptions: PDFPageOptions) => {
      if (document === null) {
        return;
      }
      const tracker = generation(document);
      if (tracker.indexes.has(index)) {
        return;
      }
      tracker.indexes.add(index);
      const stale = (): boolean => requested.current !== tracker;
      setState((previous) => ({
        ...previous,
        loading: new Set(previous.loading).add(index),
      }));
      document
        .getPage(index + 1, {
          ...pageOptions,
          resolution,
          signal: tracker.controller.signal,
        })
        .then((image) => {
          if (stale()) {
            return;
          }
          setState((previous) => {
            const pages = [...previous.pages];
            pages[index] = image;
            return { ...previous, pages };
          });
        })
        .catch((reason: unknown) => {
          if (stale()) {
            return;
          }
          tracker.indexes.delete(index);
          if (toError(reason).name !== 'AbortError') {
            setState((previous) => ({ ...previous, error: toError(reason) }));
          }
        })
        .finally(() => {
          if (stale()) {
            return;
          }
          setState((previous) => {
            const loading = new Set(previous.loading);
            loading.delete(index);
            return { ...previous, loading };
          });
        });
    },
    [document, generation, resolution],
  );

  const loadRange = useCallback(
    (from: number, to: number) => {
      if (
        document === null ||
        !Number.isInteger(from) ||
        !Number.isInteger(to)
      ) {
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
      if (
        document === null ||
        !Number.isInteger(index) ||
        index < 0 ||
        index >= document.numPages
      ) {
        return;
      }
      const tracker = generation(document);
      if (tracker.indexes.has(index)) {
        // Already queued: a second high-priority caller promotes the render.
        void document
          .getPage(index + 1, {
            priority: 'high',
            resolution,
            signal: tracker.controller.signal,
          })
          .catch(() => undefined);
      } else {
        render(index, { priority: 'high' });
      }
      loadRange(...batchBounds(index, document.numPages, prefetch, batch));
    },
    [document, generation, render, loadRange, prefetch, batch, resolution],
  );

  useEffect(() => {
    if (document !== null) {
      loadRange(0, prefetch);
    }
  }, [document, loadRange, prefetch]);

  const reload = state.reload;
  useEffect(() => {
    reload.forEach((index) => {
      render(index, { priority: 'low' });
    });
  }, [reload, render]);

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
