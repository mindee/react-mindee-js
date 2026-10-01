import brokenPDF from 'cypress/assets/broken-pdf.pdf'
import multiPage from 'cypress/assets/multi-page.pdf'

import getPDFPageCount from './getPDFPageCount'

describe('getPDFPageCount', () => {
  it('should return the number of PDF pages', () => {
    getPDFPageCount(multiPage).then((pageCount) => {
      expect(pageCount).to.equal(5)
    })
  })

  it('should catch error when the PDF is broken', () => {
    getPDFPageCount(brokenPDF).catch((error: unknown) => {
      expect((error as Error).name).to.equal('InvalidPDFException')
    })
  })
})
