import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist'

import { MAX_PDF_SCALE, PDF_RESOLUTION } from '@/common/constants'

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`

const getImageFromPage = async (
  _document: PDFDocumentProxy,
  pageNumber: number,
  resolution = PDF_RESOLUTION,
) => {
  const page: PDFPageProxy = await _document.getPage(pageNumber)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not acquire a 2D canvas context')
  }
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
  return page.render(renderContext).promise.then(() => canvas.toDataURL())
}

export default async function getImagesFromPDF(
  file: string,
  maxPages = Infinity,
  onSuccess?: () => void,
  resolution?: number,
): Promise<string[]> {
  const pdf = await getDocument(file).promise
  if (pdf.numPages > maxPages) {
    const error = new Error('Too many pages')
    error.name = 'TooManyPagesError'
    throw error
  }
  onSuccess?.()
  const results = await Promise.allSettled(
    Array.from({ length: pdf.numPages }, (_, index) =>
      getImageFromPage(pdf, index + 1, resolution),
    ),
  )
  return results.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  )
}
