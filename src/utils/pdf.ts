import type * as Pdfjs from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

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

export const loadPdfDocument = async (
  file: string,
): Promise<PDFDocumentProxy> => {
  const { getDocument } = await loadPdfjs();
  return await getDocument({ url: file }).promise;
};
