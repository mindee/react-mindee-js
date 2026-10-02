import { loadPdfDocument } from './pdf';

export default async function getPDFPageCount(file: string): Promise<number> {
  const pdf = await loadPdfDocument(file);
  return pdf.numPages;
}
