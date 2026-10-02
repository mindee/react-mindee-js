import { openPDF, type PDFSource } from './pdf';

/**
 * Counts the pages of a PDF. If you also need to render pages, use `openPDF`
 * instead so the document is only parsed once.
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
