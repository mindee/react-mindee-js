import brokenPDF from 'cypress/assets/broken-pdf.pdf';
import multiPage from 'cypress/assets/multi-page.pdf';

import { openPDF, type PDFDocumentHandle, type PDFRenderedPage } from './pdf';

const PAGE_COUNT = 5;

const collect = async (
  iterable: AsyncIterable<PDFRenderedPage>,
): Promise<PDFRenderedPage[]> => {
  const pages: PDFRenderedPage[] = [];
  for await (const page of iterable) {
    pages.push(page);
  }
  return pages;
};

const run = <T>(task: () => Promise<T>): Cypress.Chainable<T> =>
  cy.then(async () => await task());

const errorName = async (promise: Promise<unknown>): Promise<string> => {
  try {
    await promise;
    return 'resolved';
  } catch (error: unknown) {
    return (error as Error).name;
  }
};

describe('openPDF', () => {
  let handle: PDFDocumentHandle | undefined;

  afterEach(() => {
    if (handle !== undefined) {
      cy.wrap(handle.destroy());
      handle = undefined;
    }
  });

  it('exposes the page count without rendering anything', () => {
    cy.wrap(openPDF(multiPage)).then((opened) => {
      handle = opened as PDFDocumentHandle;
      expect(handle.numPages).to.equal(PAGE_COUNT);
    });
  });

  it('accepts a Blob source', () => {
    cy.wrap(
      fetch(multiPage)
        .then(async (response) => await response.blob())
        .then(async (blob) => await openPDF(blob)),
    ).then((opened) => {
      handle = opened as PDFDocumentHandle;
      expect(handle.numPages).to.equal(PAGE_COUNT);
    });
  });

  it('renders a page as an object URL by default and as a data URL on request', () => {
    run(async () => {
      const opened = await openPDF(multiPage);
      handle = opened;
      return await Promise.all([
        opened.getPage(1),
        opened.getPage(1, { output: 'data-url' }),
      ]);
    }).should(([objectUrl, dataUrl]) => {
      expect(objectUrl).to.match(/^blob:/);
      expect(dataUrl).to.match(/^data:image\/png;base64,/);
    });
  });

  it('returns the cached image when the same page is requested again', () => {
    run(async () => {
      const opened = await openPDF(multiPage);
      handle = opened;
      const first = await opened.getPage(2);
      const second = await opened.getPage(2);
      const other = await opened.getPage(2, { resolution: 50_000 });
      return { first, second, other };
    }).should(({ first, second, other }) => {
      expect(second).to.equal(first);
      expect(other).to.not.equal(first);
    });
  });

  it('rejects out of range page numbers', () => {
    run(async () => {
      const opened = await openPDF(multiPage);
      handle = opened;
      return await Promise.all([
        errorName(opened.getPage(0)),
        errorName(opened.getPage(PAGE_COUNT + 1)),
      ]);
    }).should('deep.equal', ['RangeError', 'RangeError']);
  });

  it('yields an inclusive 1-based range in order', () => {
    run(async () => {
      const opened = await openPDF(multiPage);
      handle = opened;
      return await collect(opened.getPages(2, 4));
    }).should((pages) => {
      expect(pages.map((page) => page.pageNumber)).to.deep.equal([2, 3, 4]);
      pages.forEach((page) => {
        expect(page.image).to.match(/^blob:/);
      });
    });
  });

  it('renders high priority requests before queued low priority ones', () => {
    run(async () => {
      const opened = await openPDF(multiPage);
      handle = opened;
      const order: number[] = [];
      const track = async (
        pageNumber: number,
        priority: 'high' | 'low',
      ): Promise<void> => {
        await opened.getPage(pageNumber, { priority });
        order.push(pageNumber);
      };
      await Promise.all([
        track(1, 'low'),
        track(2, 'low'),
        track(3, 'low'),
        track(5, 'high'),
      ]);
      return order;
    }).should((order) => {
      expect(order[0]).to.equal(1);
      expect(order[1]).to.equal(5);
      expect(order.slice(2)).to.deep.equal([2, 3]);
    });
  });

  it('rejects with an AbortError when a queued request is aborted', () => {
    run(async () => {
      const opened = await openPDF(multiPage);
      handle = opened;
      const controller = new AbortController();
      const first = opened.getPage(1);
      const aborted = errorName(
        opened.getPage(2, { signal: controller.signal }),
      );
      controller.abort();
      await first;
      return await aborted;
    }).should('equal', 'AbortError');
  });

  it('rejects immediately when the signal is already aborted', () => {
    run(async () => {
      const opened = await openPDF(multiPage);
      handle = opened;
      return await errorName(
        opened.getPage(1, { signal: AbortSignal.abort() }),
      );
    }).should('equal', 'AbortError');
  });

  it('revokes object URLs and refuses further renders once destroyed', () => {
    run(async () => {
      const opened = await openPDF(multiPage);
      const image = await opened.getPage(1);
      await opened.destroy();
      const revoked = await fetch(image).then(
        () => false,
        () => true,
      );
      return { revoked, afterDestroy: await errorName(opened.getPage(2)) };
    }).should(({ revoked, afterDestroy }) => {
      expect(revoked).to.equal(true);
      expect(afterDestroy).to.not.equal('resolved');
    });
  });

  it('rejects documents above maxPages with a TooManyPagesError', () => {
    cy.wrap(errorName(openPDF(multiPage, { maxPages: 3 }))).should(
      'equal',
      'TooManyPagesError',
    );
  });

  it('rejects a broken PDF with an InvalidPDFException', () => {
    cy.wrap(errorName(openPDF(brokenPDF))).should(
      'equal',
      'InvalidPDFException',
    );
  });
});
