import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;

export default async function getPDFPageCount(file: string): Promise<number> {
  const pdf = await getDocument(file).promise;
  return pdf.numPages;
}
