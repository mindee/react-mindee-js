// @flow
import pdfjs from "pdfjs-dist"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const getImagesFromPDF = (file: File | String): any =>
  new Promise<any>((resolve) => {
    const images = []
    pdfjs.getDocument(file).promise.then((pdf) => {
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        pdf.getPage(pageNumber).then(function (page) {
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
            images.push(canvas.toDataURL())
            if (pageNumber === pdf.numPages) {
              resolve(images)
            }
          })
        })
      }
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
