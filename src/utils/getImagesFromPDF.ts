import { PDF_RESOLUTION, MAX_PDF_SCALE } from '@/common/constants'
import { GlobalWorkerOptions, version, getDocument } from 'pdfjs-dist'
import {
  PDFDocumentProxy,
  PDFPageProxy,
  RenderParameters,
} from 'pdfjs-dist/types/display/api'

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`

const getImageFromPage = (
  _document: PDFDocumentProxy,
  pageNumber: number,
  resolution = PDF_RESOLUTION
) =>
  new Promise<string>(async (resolve, reject) => {
    try {
      const page: PDFPageProxy = await _document.getPage(pageNumber)
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const [, , width, height] = page.view
      const newScale = (resolution / (height * width)) ** (1 / 2)
      const safeScale = Math.min(newScale, MAX_PDF_SCALE)
      const viewport = page.getViewport({ scale: safeScale })
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }
      page
        .render(renderContext as RenderParameters)
        .promise.then(() => {
          resolve(canvas.toDataURL())
        })
        .catch((error) => {
          reject(error)
        })
    } catch (error) {
      reject(error)
    }
  })

export default function getImagesFromPDF(
  file: string,
  maxPages = Infinity,
  onSuccess?: () => void,
  resolution?: number
) {
  return new Promise<string[]>((resolve, reject) => {
    getDocument(file)
      .promise.then((document: PDFDocumentProxy) => {
        if (document.numPages > maxPages) {
          const error = new Error('Too many pages')
          error.name = 'TooManyPagesError'
          reject(error)
          return
        }
        onSuccess?.()
        Promise.allSettled(
          Array.from(Array(document.numPages).keys()).map((index) =>
            getImageFromPage(document, index + 1, resolution)
          )
        )
          .then((results) => {
            const images = results.reduce<string[]>((accumulator, result) => {
              if (result.status === 'fulfilled') {
                accumulator.push(result.value)
              }
              return accumulator
            }, [])
            resolve(images)
          })
          .catch((error) => {
            reject(error)
          })
      })
      .catch((error) => {
        reject(error)
      })
  })
}
