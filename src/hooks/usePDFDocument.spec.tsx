import { useEffect, useState, type JSX } from 'react';
import multiPage from 'cypress/assets/multi-page.pdf';

import {
  usePDFDocument,
  type UsePDFDocumentOptions,
  type UsePDFDocumentResult,
} from './usePDFDocument';

const PAGE_COUNT = 5;

type HarnessProps = {
  source: string | null;
  options?: UsePDFDocumentOptions;
  onChange: (result: UsePDFDocumentResult) => void;
};

/**
 * Renders the hook and reports every result to the test, which drives
 * `loadPage` through the latest reported value.
 */
const Harness = ({ source, options, onChange }: HarnessProps): JSX.Element => {
  const result = usePDFDocument(source, options);
  useEffect(() => {
    onChange(result);
  }, [result, onChange]);
  return (
    <ul data-cy="pages">
      {result.pages.map((page, index) => (
        <li key={String(index)} data-cy={`page-${String(index)}`}>
          {page === undefined ? 'pending' : 'ready'}
        </li>
      ))}
    </ul>
  );
};

const mountHarness = (
  source: string | null,
  options?: UsePDFDocumentOptions,
): { latest: () => UsePDFDocumentResult } => {
  let latest: UsePDFDocumentResult | undefined;
  cy.mount(
    <Harness
      source={source}
      options={options}
      onChange={(result) => {
        latest = result;
      }}
    />,
  );
  return {
    latest: () => {
      if (latest === undefined) {
        throw new Error('hook has not reported yet');
      }
      return latest;
    },
  };
};

const imageSize = async (url: string): Promise<number> =>
  await new Promise<number>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image.naturalWidth * image.naturalHeight);
    };
    image.onerror = () => {
      reject(new Error(`Could not decode ${url}`));
    };
    image.src = url;
  });

const readyCount = (result: UsePDFDocumentResult): number =>
  result.pages.filter((page) => page !== undefined).length;

describe('usePDFDocument', () => {
  it('stays idle without a source', () => {
    const harness = mountHarness(null);
    cy.wrap(null).should(() => {
      expect(harness.latest().status).to.equal('idle');
      expect(harness.latest().numPages).to.equal(0);
    });
  });

  it('opens the document and prefetches the first pages only', () => {
    const harness = mountHarness(multiPage, { prefetch: 2, batch: 2 });
    cy.wrap(null).should(() => {
      const result = harness.latest();
      expect(result.status).to.equal('ready');
      expect(result.numPages).to.equal(PAGE_COUNT);
      expect(readyCount(result)).to.equal(2);
      expect(result.loading.size).to.equal(0);
    });
    cy.get('[data-cy=page-0]').should('have.text', 'ready');
    cy.get('[data-cy=page-2]').should('have.text', 'pending');
  });

  it('loads the whole batch containing a requested page', () => {
    const harness = mountHarness(multiPage, { prefetch: 1, batch: 2 });
    cy.wrap(null).should(() => {
      expect(readyCount(harness.latest())).to.equal(1);
    });
    cy.then(() => {
      harness.latest().loadPage(4);
    });
    cy.wrap(null).should(() => {
      const result = harness.latest();
      expect(result.pages[3]).to.be.a('string');
      expect(result.pages[4]).to.be.a('string');
      expect(result.pages[1]).to.equal(undefined);
      expect(result.pages[2]).to.equal(undefined);
    });
  });

  it('marks pages as loading while they render', () => {
    const harness = mountHarness(multiPage, { prefetch: 1, batch: 1 });
    cy.wrap(null).should(() => {
      expect(harness.latest().status).to.equal('ready');
    });
    cy.then(() => {
      harness.latest().loadPage(3);
      expect(harness.latest().loadPage).to.be.a('function');
    });
    cy.wrap(null).should(() => {
      expect(harness.latest().loading.has(3)).to.equal(true);
    });
    cy.wrap(null).should(() => {
      expect(harness.latest().loading.has(3)).to.equal(false);
      expect(harness.latest().pages[3]).to.be.a('string');
    });
  });

  it('ignores page indexes outside the document', () => {
    const harness = mountHarness(multiPage, { prefetch: 1, batch: 1 });
    cy.wrap(null).should(() => {
      expect(harness.latest().status).to.equal('ready');
    });
    cy.then(() => {
      harness.latest().loadPage(-1);
      harness.latest().loadPage(PAGE_COUNT);
    });
    cy.wrap(null).should(() => {
      expect(readyCount(harness.latest())).to.equal(1);
      expect(harness.latest().error).to.equal(null);
    });
  });

  it('promotes a page still queued behind the prefetch when loadPage asks for it', () => {
    const harness = mountHarness(multiPage, { prefetch: 5, batch: 1 });
    cy.wrap(null).should(() => {
      expect(harness.latest().status).to.equal('ready');
      expect(harness.latest().loading.size).to.be.greaterThan(0);
    });
    cy.then(() => {
      harness.latest().loadPage(4);
    });
    cy.wrap(null).should(() => {
      const result = harness.latest();
      expect(result.pages[4]).to.be.a('string');
      expect(result.pages[2]).to.equal(undefined);
    });
  });

  it('resets to an error without exposing the previous document when maxPages tightens', () => {
    const Limiter = (): JSX.Element => {
      const [maxPages, setMaxPages] = useState<number | undefined>(undefined);
      const result = usePDFDocument(multiPage, { prefetch: 1, maxPages });
      return (
        <div>
          <span data-cy="status">{result.status}</span>
          <span data-cy="doc">{result.document === null ? 'null' : 'set'}</span>
          <span data-cy="count">{String(result.numPages)}</span>
          <button
            data-cy="limit"
            onClick={() => {
              setMaxPages(2);
            }}
          >
            limit
          </button>
        </div>
      );
    };
    cy.mount(<Limiter />);
    cy.get('[data-cy=status]').should('have.text', 'ready');
    cy.get('[data-cy=limit]').click();
    cy.get('[data-cy=status]').should('have.text', 'error');
    cy.get('[data-cy=doc]').should('have.text', 'null');
    cy.get('[data-cy=count]').should('have.text', '0');
  });

  it('re-renders every page at the new resolution when the option changes', () => {
    const Resizer = (): JSX.Element => {
      const [resolution, setResolution] = useState(100_000);
      const result = usePDFDocument(multiPage, { prefetch: 2, resolution });
      return (
        <div>
          <span data-cy="status">{result.status}</span>
          <span data-cy="ready">
            {String(result.pages.filter((page) => page !== undefined).length)}
          </span>
          <span data-cy="first">{result.pages[0] ?? ''}</span>
          <span data-cy="last">{result.pages[PAGE_COUNT - 1] ?? ''}</span>
          <button
            data-cy="load-last"
            onClick={() => {
              result.loadPage(PAGE_COUNT - 1);
            }}
          >
            load last
          </button>
          <button
            data-cy="grow"
            onClick={() => {
              setResolution(400_000);
            }}
          >
            grow
          </button>
        </div>
      );
    };
    cy.mount(<Resizer />);
    cy.get('[data-cy=ready]').should('have.text', '2');
    cy.get('[data-cy=load-last]').click();
    cy.get('[data-cy=ready]').should('have.text', '3');
    cy.get('[data-cy=first]')
      .invoke('text')
      .then((before) => {
        cy.get('[data-cy=grow]').click();
        cy.get('[data-cy=ready]').should('have.text', '3');
        cy.get('[data-cy=last]')
          .invoke('text')
          .should('match', /^blob:/);
        cy.get('[data-cy=first]')
          .invoke('text')
          .should('not.equal', before)
          .then(async (after) => {
            const [small, large] = await Promise.all([
              imageSize(before),
              imageSize(after),
            ]);
            expect(large).to.be.greaterThan(small);
          });
      });
  });

  it('switches directly from one source to another without erroring', () => {
    const Switcher = (): JSX.Element => {
      const [source, setSource] = useState<string | Blob>(multiPage);
      const result = usePDFDocument(source, { prefetch: 1 });
      return (
        <div>
          <span data-cy="status">{result.status}</span>
          <span data-cy="first">{result.pages[0] ?? ''}</span>
          <button
            data-cy="swap"
            onClick={() => {
              void fetch(multiPage)
                .then(async (response) => await response.blob())
                .then(setSource);
            }}
          >
            swap
          </button>
        </div>
      );
    };
    cy.mount(<Switcher />);
    cy.get('[data-cy=first]')
      .should('not.have.text', '')
      .invoke('text')
      .then((before) => {
        cy.get('[data-cy=swap]').click();
        cy.get('[data-cy=status]').should('have.text', 'ready');
        cy.get('[data-cy=first]')
          .should('not.have.text', '')
          .should('not.have.text', before);
        cy.get('[data-cy=status]').should('have.text', 'ready');
      });
  });

  it('aborts pending renders of the previous resolution', () => {
    const Resizer = (): JSX.Element => {
      const [resolution, setResolution] = useState(100_000);
      const result = usePDFDocument(multiPage, { prefetch: 5, resolution });
      return (
        <div>
          <span data-cy="status">{result.status}</span>
          <span data-cy="loading">{String(result.loading.size)}</span>
          <span data-cy="ready">{String(readyCount(result))}</span>
          <span data-cy="error">{result.error?.message ?? 'none'}</span>
          <button
            data-cy="grow"
            onClick={() => {
              setResolution(400_000);
            }}
          >
            grow
          </button>
        </div>
      );
    };
    cy.mount(<Resizer />);
    // Switch while the 5-page prefetch is still rendering.
    cy.get('[data-cy=status]').should('have.text', 'ready');
    cy.get('[data-cy=grow]').click();
    cy.get('[data-cy=ready]').should('have.text', String(PAGE_COUNT));
    cy.get('[data-cy=loading]').should('have.text', '0');
    cy.get('[data-cy=error]').should('have.text', 'none');
  });

  it('ignores renders of the previous document after a source swap mid-prefetch', () => {
    const Swapper = (): JSX.Element => {
      const [source, setSource] = useState<string | Blob>(multiPage);
      const result = usePDFDocument(source, { prefetch: 5 });
      return (
        <div>
          <span data-cy="status">{result.status}</span>
          <span data-cy="error">{result.error?.message ?? 'none'}</span>
          <span data-cy="loading">{String(result.loading.size)}</span>
          <span data-cy="ready">{String(readyCount(result))}</span>
          <button
            data-cy="swap"
            onClick={() => {
              void fetch(multiPage)
                .then(async (response) => await response.blob())
                .then(setSource);
            }}
          >
            swap
          </button>
        </div>
      );
    };
    cy.mount(<Swapper />);
    cy.get('[data-cy=status]').should('have.text', 'ready');
    cy.get('[data-cy=swap]').click();
    cy.get('[data-cy=ready]').should('have.text', String(PAGE_COUNT));
    cy.get('[data-cy=loading]').should('have.text', '0');
    cy.get('[data-cy=error]').should('have.text', 'none');
    cy.get('[data-cy=status]').should('have.text', 'ready');
  });

  it('throws a RangeError for invalid prefetch or batch options', () => {
    const Probe = ({
      options,
    }: {
      options: { prefetch?: number; batch?: number };
    }): JSX.Element => {
      let message = 'ok';
      try {
        usePDFDocument(null, options);
      } catch (error: unknown) {
        message = error instanceof RangeError ? error.name : 'other';
      }
      return <span data-cy="probe">{message}</span>;
    };
    cy.mount(<Probe options={{ batch: 0 }} />);
    cy.get('[data-cy=probe]').should('have.text', 'RangeError');
    cy.mount(<Probe options={{ prefetch: 1.5 }} />);
    cy.get('[data-cy=probe]').should('have.text', 'RangeError');
    cy.mount(<Probe options={{ prefetch: -1 }} />);
    cy.get('[data-cy=probe]').should('have.text', 'RangeError');
    cy.mount(<Probe options={{ prefetch: 0, batch: 1 }} />);
    cy.get('[data-cy=probe]').should('have.text', 'ok');
  });

  it('reports an error status for an unreadable source', () => {
    const harness = mountHarness('data:application/pdf;base64,AAAA');
    cy.wrap(null).should(() => {
      expect(harness.latest().status).to.equal('error');
      expect(harness.latest().error).to.be.instanceOf(Error);
    });
  });

  it('destroys the document and revokes its pages when the source changes', () => {
    const Switcher = (): JSX.Element => {
      const [source, setSource] = useState<string | null>(multiPage);
      const result = usePDFDocument(source, { prefetch: 1 });
      return (
        <div>
          <span data-cy="status">{result.status}</span>
          <span data-cy="first">{result.pages[0] ?? ''}</span>
          <button
            data-cy="clear"
            onClick={() => {
              setSource(null);
            }}
          >
            clear
          </button>
        </div>
      );
    };
    cy.window().then((win) => {
      cy.spy(win.URL, 'revokeObjectURL').as('revoke');
    });
    cy.mount(<Switcher />);
    cy.get('[data-cy=first]')
      .should('not.have.text', '')
      .invoke('text')
      .then((url) => {
        cy.get('[data-cy=clear]').click();
        cy.get('[data-cy=status]').should('have.text', 'idle');
        cy.get('@revoke').should('have.been.calledWith', url);
      });
  });
});
