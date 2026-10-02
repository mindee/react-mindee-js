import { openPDF, type PDFSource } from './pdf';

/**
 * Renders every page of a PDF to a PNG data URL.
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
    const images: string[] = [];
    for await (const { image } of pdf.getPages(1, pdf.numPages, {
      resolution,
      output: 'data-url',
    })) {
      images.push(image);
    }
    return images;
  } finally {
    await pdf.destroy();
  }
}
