import brokenPDF from 'cypress/assets/broken-pdf.pdf'
import multiPage from 'cypress/assets/multi-page.pdf'

import getImagesFromPDF from './getImagesFromPDF'

describe('getImageFromPDF', () => {
  it('should return PDF pages', () => {
    getImagesFromPDF(multiPage).then((images) => {
      expect(images.length).to.equal(5)
    })
  })

  it('should catch error when the PDF is broken', () => {
    getImagesFromPDF(brokenPDF).catch((error) => {
      expect(error.name).to.equal('InvalidPDFException')
    })
  })

  it('should catch error when the PDF has too many Pages', () => {
    getImagesFromPDF(multiPage, 3).catch((error) => {
      expect(error.name).to.equal('TooManyPagesError')
    })
  })
})
