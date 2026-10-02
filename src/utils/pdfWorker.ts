// Inlined (blob) worker: a file-relative worker URL breaks once consumers'
// bundlers pre-bundle or relocate dist/index.js, an inline worker does not.
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&inline';

export const createPdfWorker = (): Worker => new PdfWorker();
