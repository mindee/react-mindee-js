import { openPDF, type PDFSource } from './pdf';

/**
 * Renders every page of a PDF to a PNG data URL. Pages that fail to render
 * are skipped.
 *
 * @deprecated Renders and holds all pages in memory at once. Use `openPDF`
 * (or the `usePDFDocument` hook) to render pages progressively instead.
 */
export default async function getImagesFromPDF(
  file: PDFSource,
  maxPages = Infinity,
  onSuccess?: () => void,
  resolution?: number,
): Promise<string[]> {
  const pdf = await openPDF(file, { maxPages });
  try {
    onSuccess?.();
    const pageNumbers = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
    const results = await Promise.allSettled(
      pageNumbers.map(
        async (pageNumber) =>
          await pdf.getPage(pageNumber, {
            resolution,
            output: 'data-url',
            priority: 'low',
          }),
      ),
    );
    return results
      .filter(
        (result): result is PromiseFulfilledResult<string> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);
  } finally {
    await pdf.destroy();
  }
}
