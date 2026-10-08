import { loadDist } from './helpers';

/**
 * Guards the public runtime surface of the package. A missing or renamed
 * export is a breaking change for consumers and must be deliberate.
 */
describe('built library public API', () => {
  const expectedFunctions = [
    'AnnotationLens',
    'AnnotationViewer',
    'dataURItoBlob',
    'drawLayer',
    'drawShape',
    'drawShapes',
    'getImagesFromPDF',
    'getPDFPageCount',
    'getZoomScale',
    'openPDF',
    'setShapeConfig',
    'toBase64',
    'usePDFDocument',
  ];

  it('exposes exactly the documented runtime exports, all of them functions', () => {
    loadDist().then((lib) => {
      expect(Object.keys(lib).sort()).to.deep.equal(expectedFunctions);
      expectedFunctions.forEach((name) => {
        expect(lib[name as keyof typeof lib]).to.be.a('function');
      });
    });
  });

  it('builds data URLs with toBase64, defaulting to image/jpeg', () => {
    loadDist().then(({ toBase64 }) => {
      expect(toBase64('AAAA')).to.equal('data:image/jpeg;base64,AAAA');
      expect(toBase64('AAAA', 'application/pdf')).to.equal(
        'data:application/pdf;base64,AAAA',
      );
    });
  });

  it('round-trips a data URL through dataURItoBlob', () => {
    loadDist().then(({ dataURItoBlob, toBase64 }) => {
      const payload = btoa('hello');
      const blob = dataURItoBlob(toBase64(payload, 'image/png'));
      expect(blob.type).to.equal('image/png');
      expect(blob.size).to.equal(5);
      cy.wrap(blob.text()).should('equal', 'hello');
    });
  });

  it('rejects malformed input in dataURItoBlob instead of producing an empty blob', () => {
    loadDist().then(({ dataURItoBlob }) => {
      expect(() => dataURItoBlob('not-a-data-url')).to.throw();
    });
  });
});
