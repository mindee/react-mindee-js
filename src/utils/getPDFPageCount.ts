import { openPDF, type PDFSource } from './pdf';

/**
 * Counts the pages of a PDF.
 */
export default async function getPDFPageCount(
  file: PDFSource,
): Promise<number> {
  const pdf = await openPDF(file);
  try {
    return pdf.numPages;
  } finally {
    await pdf.destroy();
  }
}
