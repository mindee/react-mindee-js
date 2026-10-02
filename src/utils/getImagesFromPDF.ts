import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

import { MAX_PDF_SCALE, PDF_RESOLUTION } from '@/common/constants';

import { loadPdfDocument } from './pdf';

const getImageFromPage = async (
  _document: PDFDocumentProxy,
  pageNumber: number,
  resolution = PDF_RESOLUTION,
): Promise<string> => {
  const page: PDFPageProxy = await _document.getPage(pageNumber);
  const canvas = document.createElement('canvas');
  const [, , width, height] = page.view;
  if (width === undefined || height === undefined) {
    throw new Error('Invalid PDF page view');
  }
  const newScale = (resolution / (height * width)) ** (1 / 2);
  const safeScale = Math.min(newScale, MAX_PDF_SCALE);
  const viewport = page.getViewport({ scale: safeScale });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvas, viewport }).promise;
  return canvas.toDataURL();
};

export default async function getImagesFromPDF(
  file: string,
  maxPages = Infinity,
  onSuccess?: () => void,
  resolution?: number,
): Promise<string[]> {
  const pdf = await loadPdfDocument(file);
  if (pdf.numPages > maxPages) {
    const error = new Error('Too many pages');
    error.name = 'TooManyPagesError';
    throw error;
  }
  onSuccess?.();
  const results = await Promise.allSettled(
    Array.from(
      { length: pdf.numPages },
      async (_, index) => await getImageFromPage(pdf, index + 1, resolution),
    ),
  );
  return results.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  );
}
