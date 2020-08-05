// @flow
import pdfjs from "pdfjs-dist"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const getImageFromPage = (pdf: any, pageNumber) =>
  new Promise((resolve, reject) => {
    pdf
      .getPage(pageNumber)
      .then(function (page) {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        const viewport = page.getViewport({ scale: 1 })
        canvas.height = viewport.height
        canvas.width = viewport.width
        var renderContext = {
          canvasContext: context,
          viewport: viewport,
        }
        page
          .render(renderContext)
          .promise.then(() => {
            resolve(canvas.toDataURL())
          })
          .catch(() => {
            reject(null)
          })
      })
      .catch(() => {
        reject(null)
      })
  })

export const getImagesFromPDF = (file: File | String): any =>
  new Promise((resolve, reject) => {
    pdfjs.getDocument(file).promise.then((pdf) => {
      Promise.all(
        Array.from(Array(pdf.numPages).keys()).map((index) =>
          getImageFromPage(pdf, index + 1)
        )
      )
        .then((images) => {
          resolve(images)
        })
        .catch(() => {
          reject([])
        })
    })
  })

export const getPDFData = (file: File | String): any =>
  new Promise<any>((resolve) => {
    pdfjs.getDocument(file).promise.then((pdf) => {
      pdf.getPage(1).then(function (page) {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        const viewport = page.getViewport({ scale: 1 })
        canvas.height = viewport.height
        canvas.width = viewport.width
        var renderContext = {
          canvasContext: context,
          viewport: viewport,
        }
        page.render(renderContext).promise.then(function () {
          resolve({
            firstPage: canvas.toDataURL(),
            numPages: pdf.numPages,
          })
        })
      })
    })
  })
