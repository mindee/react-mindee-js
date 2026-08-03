import {
  getDocument,
  GlobalWorkerOptions,
  PDFDocumentProxy,
  version,
} from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`

export default function getPDFPageCount(file: string) {
  return new Promise<number>((resolve, reject) => {
    getDocument(file)
      .promise.then((document: PDFDocumentProxy) => resolve(document.numPages))
      .catch((error) => reject(error))
  })
}
