import brokenPDF from 'cypress/assets/broken-pdf.pdf';
import multiPage from 'cypress/assets/multi-page.pdf';

import { imageDimensions, loadDist } from './helpers';

const PAGE_COUNT = 5;

/**
 * Runs expectations against dist/ (rather than the sources).
 */
describe('built library PDF support', () => {
  it('does not spawn the pdf.js worker until a PDF is actually processed', () => {
    cy.window().then((win) => {
      cy.spy(win, 'Worker').as('worker');
    });
    loadDist({ fresh: true }).then(({ getPDFPageCount }) => {
      cy.get('@worker').should('not.have.been.called');
      cy.wrap(getPDFPageCount(multiPage)).should('equal', PAGE_COUNT);
    });
    cy.get('@worker').should('have.been.calledOnce');
  });

  it('spawns a real Web Worker from a blob URL instead of falling back to the main thread', () => {
    cy.window().then((win) => {
      cy.spy(win, 'Worker').as('worker');
    });
    loadDist({ fresh: true }).then(({ getPDFPageCount }) => {
      cy.wrap(getPDFPageCount(multiPage)).should('equal', PAGE_COUNT);
    });
    cy.get<sinon.SinonSpy>('@worker').should((spy) => {
      expect(spy.calledWithNew()).to.equal(true);
      expect(String(spy.firstCall.args[0])).to.match(/^blob:/);
    });
  });

  it('reuses a single worker across documents and calls', () => {
    cy.window().then((win) => {
      cy.spy(win, 'Worker').as('worker');
    });
    loadDist({ fresh: true }).then(({ getPDFPageCount, getImagesFromPDF }) => {
      cy.wrap(getPDFPageCount(multiPage)).should('equal', PAGE_COUNT);
      cy.wrap(getImagesFromPDF(multiPage)).should('have.length', PAGE_COUNT);
      cy.wrap(getPDFPageCount(multiPage)).should('equal', PAGE_COUNT);
    });
    cy.get('@worker').should('have.been.calledOnce');
  });

  it('renders every page to a PNG data URL', () => {
    loadDist().then(({ getImagesFromPDF }) => {
      cy.wrap<Promise<string[]>, string[]>(getImagesFromPDF(multiPage)).should(
        (images) => {
          expect(images).to.have.length(PAGE_COUNT);
          images.forEach((image) => {
            expect(image).to.match(/^data:image\/png;base64,/);
          });
        },
      );
    });
  });

  it('produces decodable images whose size follows the requested resolution', () => {
    loadDist().then(({ getImagesFromPDF }) => {
      type Dimensions = Awaited<ReturnType<typeof imageDimensions>>;
      const render = async (resolution: number): Promise<Dimensions> => {
        const images = await getImagesFromPDF(
          multiPage,
          Infinity,
          undefined,
          resolution,
        );
        return await imageDimensions(images[0] ?? '');
      };
      cy.wrap<Promise<[Dimensions, Dimensions]>, [Dimensions, Dimensions]>(
        Promise.all([render(500_000), render(2_000_000)]),
      ).should(([small, large]) => {
        expect(small.width * small.height).to.be.greaterThan(0);
        expect(large.width * large.height).to.be.greaterThan(
          small.width * small.height,
        );
      });
    });
  });

  it('invokes onSuccess once the document is accepted, before pages resolve', () => {
    const onSuccess = cy.spy().as('onSuccess');
    loadDist().then(({ getImagesFromPDF }) => {
      cy.wrap(getImagesFromPDF(multiPage, Infinity, onSuccess)).should(
        'have.length',
        PAGE_COUNT,
      );
    });
    cy.get('@onSuccess').should('have.been.calledOnce');
  });

  it('rejects with TooManyPagesError without invoking onSuccess when the page cap is exceeded', () => {
    const onSuccess = cy.spy().as('onSuccess');
    loadDist().then(({ getImagesFromPDF }) => {
      cy.wrap(
        getImagesFromPDF(multiPage, PAGE_COUNT - 1, onSuccess).then(
          () => 'resolved',
          (error: unknown) => (error as Error).name,
        ),
      ).should('equal', 'TooManyPagesError');
    });
    cy.get('@onSuccess').should('not.have.been.called');
  });

  it('rejects a broken PDF with InvalidPDFException from both entry points', () => {
    loadDist().then(({ getImagesFromPDF, getPDFPageCount }) => {
      cy.wrap(
        getImagesFromPDF(brokenPDF).then(
          () => 'resolved',
          (error: unknown) => (error as Error).name,
        ),
      ).should('equal', 'InvalidPDFException');
      cy.wrap(
        getPDFPageCount(brokenPDF).then(
          () => 'resolved',
          (error: unknown) => (error as Error).name,
        ),
      ).should('equal', 'InvalidPDFException');
    });
  });

  it('keeps working after a failed document', () => {
    loadDist().then(({ getImagesFromPDF, getPDFPageCount }) => {
      cy.wrap(getImagesFromPDF(brokenPDF).catch(() => undefined));
      cy.wrap(getPDFPageCount(multiPage)).should('equal', PAGE_COUNT);
    });
  });

  it('renders pages on demand through openPDF with the inlined worker', () => {
    cy.window().then((win) => {
      cy.spy(win, 'Worker').as('worker');
    });
    loadDist({ fresh: true }).then(({ openPDF }) => {
      cy.then(async () => {
        const handle = await openPDF(multiPage);
        const image = await handle.getPage(1);
        const size = await imageDimensions(image);
        await handle.destroy();
        return { numPages: handle.numPages, image, size };
      }).should(({ numPages, image, size }) => {
        expect(numPages).to.equal(PAGE_COUNT);
        expect(image).to.match(/^blob:/);
        expect(size.width * size.height).to.be.greaterThan(0);
      });
    });
    cy.get<sinon.SinonSpy>('@worker').should((spy) => {
      expect(spy.calledOnce).to.equal(true);
      expect(String(spy.firstCall.args[0])).to.match(/^blob:/);
    });
  });

  it('exposes usePDFDocument from the built entry point', () => {
    loadDist().then(({ usePDFDocument }) => {
      expect(usePDFDocument).to.be.a('function');
    });
  });
});
