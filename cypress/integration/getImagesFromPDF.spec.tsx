import { getImagesFromPDF } from '../../dist'
import multiPage from '../assets/multi-page.pdf'
import brokenPDF from '../assets/broken-pdf.pdf'

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
