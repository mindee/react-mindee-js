import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&inline';

export const createPdfWorker = (): Worker => new PdfWorker();
