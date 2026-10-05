import type * as Pdfjs from 'pdfjs-dist';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

import { MAX_PDF_SCALE, PDF_RESOLUTION } from '@/common/constants';

let pdfjsModule: Promise<typeof Pdfjs> | undefined;

/**
 * Loads pdf.js and its worker on first use, so consumers need no CDN access or
 * manual worker configuration. Both live in lazy chunks outside the main bundle.
 */
const loadPdfjs = async (): Promise<typeof Pdfjs> => {
  pdfjsModule ??= Promise.all([import('pdfjs-dist'), import('./pdfWorker')])
    .then(([pdfjs, { createPdfWorker }]) => {
      pdfjs.GlobalWorkerOptions.workerPort = createPdfWorker();
      return pdfjs;
    })
    .catch((error: unknown) => {
      pdfjsModule = undefined;
      throw error;
    });
  return await pdfjsModule;
};

export type PDFSource = string | Blob | ArrayBuffer | Uint8Array;

export type PDFPageOutput = 'object-url' | 'data-url';

export type PDFPagePriority = 'high' | 'low';

export type PDFPageOptions = {
  /**
   * Target pixel count of the rendered page (width × height). Defaults to
   * 1.5 Mpx, which is what the viewer displays; use a much lower value such
   * as 50 000 for thumbnails. Renders at different resolutions are cached
   * independently.
   */
  resolution?: number;
  /**
   * `object-url` (default) returns a `blob:` URL backed by a PNG blob, which
   * is cheaper to hold in memory and is revoked by `destroy()`. `data-url`
   * returns a base64 PNG data URL for callers that need a self-contained
   * string.
   */
  output?: PDFPageOutput;
  /**
   * `high` (default for `getPage`) puts the request ahead of everything still
   * waiting, so that a page the user explicitly asked for is rendered before
   * background prefetches. `low` (default for `getPages`) appends to the
   * queue.
   */
  priority?: PDFPagePriority;
  /**
   * Aborting removes the request from the queue, or cancels the in-progress
   * render, and rejects the returned promise with an `AbortError`.
   */
  signal?: AbortSignal;
};

export type PDFRenderedPage = {
  /** 1-based page number. */
  pageNumber: number;
  image: string;
};

/**
 * A parsed PDF document from which pages can be rendered on demand. Pages
 * render one at a time (pdf.js renders serially per document anyway), in
 * priority order, and every successful render is cached for the lifetime of
 * the handle.
 */
export type PDFDocumentHandle = {
  readonly numPages: number;
  /** Renders a single page. `pageNumber` is 1-based, like pdf.js. */
  getPage: (pageNumber: number, options?: PDFPageOptions) => Promise<string>;
  /**
   * Renders pages `from` to `to` inclusive (1-based), yielding each page as
   * soon as it is ready. Iterate with `for await`.
   */
  getPages: (
    from: number,
    to: number,
    options?: PDFPageOptions,
  ) => AsyncIterable<PDFRenderedPage>;
  /**
   * Cancels pending renders, revokes every object URL handed out by this
   * handle and releases the pdf.js document. The handle is unusable after.
   */
  destroy: () => Promise<void>;
};

export type OpenPDFOptions = {
  /** Rejects with a `TooManyPagesError` when the document has more pages. */
  maxPages?: number;
};

/** One awaiting caller of a render; several callers can share a request. */
type Caller = {
  resolve: (image: string) => void;
  reject: (error: unknown) => void;
  signal: AbortSignal | undefined;
  onAbort: (() => void) | undefined;
};

/**
 * A page render shared by every caller that asked for the same page at the
 * same resolution and output. It is cancelled only once all of them aborted.
 */
type RenderRequest = {
  key: string;
  pageNumber: number;
  resolution: number;
  output: PDFPageOutput;
  callers: Caller[];
};

const abortError = (): Error => {
  const error = new Error('PDF page rendering was aborted');
  error.name = 'AbortError';
  return error;
};

const tooManyPagesError = (): Error => {
  const error = new Error('Too many pages');
  error.name = 'TooManyPagesError';
  return error;
};

const destroyedError = (): Error =>
  new Error('This PDF document handle has been destroyed');

const assertPageInRange = (pageNumber: number, numPages: number): void => {
  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > numPages
  ) {
    throw new RangeError(
      `Page ${String(pageNumber)} is out of range (1-${String(numPages)})`,
    );
  }
};

const toDocumentParameters = async (
  source: PDFSource,
): Promise<{ url: string } | { data: Uint8Array }> => {
  if (typeof source === 'string') {
    return { url: source };
  }
  if (source instanceof Blob) {
    return { data: new Uint8Array(await source.arrayBuffer()) };
  }
  if (source instanceof Uint8Array) {
    return { data: source };
  }
  return { data: new Uint8Array(source) };
};

const canvasToBlob = async (canvas: HTMLCanvasElement): Promise<Blob> =>
  await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error('Could not encode the rendered PDF page'));
      } else {
        resolve(blob);
      }
    }, 'image/png');
  });

/**
 * Serial, priority-ordered render queue bound to one pdf.js document. Only
 * one render task is in flight at any time, so a high-priority request can
 * only be delayed by the single page currently being drawn.
 */
class PDFRenderQueue {
  private readonly queue: RenderRequest[] = [];
  private readonly cache = new Map<string, string>();
  private readonly inFlight = new Map<string, RenderRequest>();
  private readonly objectUrls = new Set<string>();
  private current: { request: RenderRequest; task?: RenderTask } | undefined;
  private destroyed = false;

  constructor(private readonly document: PDFDocumentProxy) {}

  public async request(
    pageNumber: number,
    options: PDFPageOptions,
    defaultPriority: PDFPagePriority,
  ): Promise<string> {
    if (this.destroyed) {
      throw destroyedError();
    }
    assertPageInRange(pageNumber, this.document.numPages);
    if (options.signal?.aborted === true) {
      throw abortError();
    }

    const resolution = options.resolution ?? PDF_RESOLUTION;
    const output = options.output ?? 'object-url';
    const key = `${String(pageNumber)}@${String(resolution)}:${output}`;

    const cached = this.cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const priority = options.priority ?? defaultPriority;
    let request = this.inFlight.get(key);
    if (request === undefined) {
      request = { key, pageNumber, resolution, output, callers: [] };
      this.inFlight.set(key, request);
      this.queue.push(request);
    }
    if (priority === 'high') {
      this.promote(request);
    }
    const image = this.attach(request, options.signal);
    void this.drain();
    return await image;
  }

  public async destroy(): Promise<void> {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.queue.splice(0).forEach((request) => {
      this.settle(request, (caller) => {
        caller.reject(destroyedError());
      });
    });
    this.current?.task?.cancel();
    this.objectUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.objectUrls.clear();
    this.cache.clear();
    await this.document.loadingTask.destroy();
  }

  /** Moves a queued request to the front; no-op if it is already rendering. */
  private promote(request: RenderRequest): void {
    const index = this.queue.indexOf(request);
    if (index > 0) {
      this.queue.splice(index, 1);
      this.queue.unshift(request);
    }
  }

  /**
   * Registers a caller on a request and returns its own promise, which
   * rejects with an `AbortError` as soon as *its* signal aborts without
   * affecting the other callers.
   */
  private async attach(
    request: RenderRequest,
    signal: AbortSignal | undefined,
  ): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      const caller: Caller = { resolve, reject, signal, onAbort: undefined };
      if (signal !== undefined) {
        caller.onAbort = () => {
          this.detach(request, caller);
        };
        signal.addEventListener('abort', caller.onAbort, { once: true });
      }
      request.callers.push(caller);
    });
  }

  /**
   * Removes an aborting caller. The shared render is dropped (or cancelled
   * if in progress) only when nobody is waiting for it anymore.
   */
  private detach(request: RenderRequest, caller: Caller): void {
    const index = request.callers.indexOf(caller);
    if (index === -1) {
      return;
    }
    request.callers.splice(index, 1);
    caller.reject(abortError());
    if (request.callers.length > 0) {
      return;
    }
    const queued = this.queue.indexOf(request);
    if (queued !== -1) {
      this.queue.splice(queued, 1);
      this.inFlight.delete(request.key);
      return;
    }
    if (this.current?.request === request) {
      this.current.task?.cancel();
    }
  }

  /** Settles every remaining caller and releases the request. */
  private settle(
    request: RenderRequest,
    settleCaller: (caller: Caller) => void,
  ): void {
    this.inFlight.delete(request.key);
    request.callers.splice(0).forEach((caller) => {
      if (caller.signal !== undefined && caller.onAbort !== undefined) {
        caller.signal.removeEventListener('abort', caller.onAbort);
      }
      settleCaller(caller);
    });
  }

  private async drain(): Promise<void> {
    if (this.current !== undefined) {
      return;
    }
    let request = this.queue.shift();
    while (request !== undefined) {
      this.current = { request };
      try {
        const image = await this.render(request);
        if (!this.destroyed) {
          this.cache.set(request.key, image);
        }
        this.settle(request, (caller) => {
          caller.resolve(image);
        });
      } catch (error: unknown) {
        const reason = this.destroyed ? destroyedError() : error;
        this.settle(request, (caller) => {
          caller.reject(reason);
        });
      } finally {
        this.current = undefined;
      }
      request = this.queue.shift();
    }
  }

  private async render(request: RenderRequest): Promise<string> {
    const page = await this.document.getPage(request.pageNumber);
    const [, , width, height] = page.view;
    if (width === undefined || height === undefined) {
      throw new Error('Invalid PDF page view');
    }
    const scale = Math.min(
      (request.resolution / (height * width)) ** (1 / 2),
      MAX_PDF_SCALE,
    );
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const task = page.render({ canvas, viewport });
    if (this.current?.request === request) {
      this.current.task = task;
    }
    if (request.callers.length === 0 || this.destroyed) {
      task.cancel();
    }
    await task.promise;

    if (request.output === 'data-url') {
      return canvas.toDataURL('image/png');
    }
    const url = URL.createObjectURL(await canvasToBlob(canvas));
    this.objectUrls.add(url);
    return url;
  }
}

/**
 * Parses a PDF once and returns a handle to render its pages on demand.
 * Prefer this over `getImagesFromPDF` whenever the document may have more
 * than a handful of pages: only the pages you ask for are rendered, the
 * requested one first, and memory is released by `destroy()`.
 *
 * @example
 * const doc = await openPDF(file);
 * const firstPage = await doc.getPage(1);
 * for await (const { pageNumber, image } of doc.getPages(2, 5)) {
 *   show(pageNumber, image);
 * }
 * await doc.destroy();
 */
export const openPDF = async (
  source: PDFSource,
  options: OpenPDFOptions = {},
): Promise<PDFDocumentHandle> => {
  const { getDocument } = await loadPdfjs();
  const pdf = await getDocument(await toDocumentParameters(source)).promise;
  if (options.maxPages !== undefined && pdf.numPages > options.maxPages) {
    await pdf.loadingTask.destroy();
    throw tooManyPagesError();
  }

  const queue = new PDFRenderQueue(pdf);
  return {
    numPages: pdf.numPages,
    getPage: async (pageNumber, pageOptions = {}) =>
      await queue.request(pageNumber, pageOptions, 'high'),
    getPages: (from, to, pageOptions = {}) => ({
      async *[Symbol.asyncIterator]() {
        assertPageInRange(from, pdf.numPages);
        assertPageInRange(to, pdf.numPages);
        if (to < from) {
          throw new RangeError(
            `Invalid page range: ${String(from)}-${String(to)}`,
          );
        }
        const requests = Array.from({ length: to - from + 1 }, (_, index) => {
          const pageNumber = from + index;
          return {
            pageNumber,
            image: queue.request(pageNumber, pageOptions, 'low'),
          };
        });
        for (const { pageNumber, image } of requests) {
          yield { pageNumber, image: await image };
        }
      },
    }),
    destroy: async () => {
      await queue.destroy();
    },
  };
};
