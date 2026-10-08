import { useState } from 'react';
import type { AnnotationShape, AnnotationViewerOptions } from '@/index';
import dummyImage from 'cypress/assets/demo.jpg';
import { dummyShapes } from 'cypress/assets/shapes';
import type { Line } from 'konva/lib/shapes/Line';
import type { Stage } from 'konva/lib/Stage';

import { CONTAINER_STYLE, loadDist, type DistLibrary } from './helpers';

const containerId = 'annotationViewer';
const SHAPE_HIT = { x: 350, y: 50 };
const EMPTY_AREA = { x: 10, y: 10 };

type MountResult = { stage: () => Stage };

/**
 * Mounts the built AnnotationViewer with the demo image and shapes.
 */
const mountViewer = (
  lib: DistLibrary,
  props: {
    shapes?: AnnotationShape[];
    options?: AnnotationViewerOptions;
    orientation?: 0 | 90 | 180 | 270;
    customZoomLevel?: number;
    onShapeClick?: (shape: AnnotationShape) => void;
    onShapeMouseEnter?: (shape: AnnotationShape) => void;
    onShapeMouseLeave?: (shape: AnnotationShape) => void;
    onShapeMultiSelect?: (shapes: AnnotationShape[]) => void;
    getPointerPosition?: (position: { x: number; y: number }) => void;
  } = {},
): Cypress.Chainable<MountResult> => {
  let stage: Stage | undefined;
  const { shapes = dummyShapes, orientation, ...rest } = props;
  return cy
    .mount(
      <lib.AnnotationViewer
        id={containerId}
        data={{ image: dummyImage, shapes, orientation }}
        style={CONTAINER_STYLE}
        getStage={(value) => {
          stage = value;
        }}
        {...rest}
      />,
    )
    .then(() => {
      cy.get(`#${containerId} canvas`).should('have.length.at.least', 1);
    })
    .then(() => ({
      stage: (): Stage => {
        if (stage === undefined) {
          throw new Error('getStage was never called');
        }
        return stage;
      },
    }));
};

const waitForShapes = (stage: () => Stage, count: number): void => {
  cy.wrap(null).should(() => {
    expect(stage().find('Line')).to.have.length(count);
  });
};

describe('built library AnnotationViewer', () => {
  it('draws one Konva.Line per shape, addressable by the shape id', () => {
    loadDist().then((lib) => {
      mountViewer(lib).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
        cy.wrap(null).should(() => {
          dummyShapes.forEach((shape) => {
            expect(stage().findOne(`#${shape.id}`)).to.not.equal(undefined);
          });
        });
      });
    });
  });

  it('redraws the existing stage when the shapes prop changes after mount', () => {
    loadDist().then((lib) => {
      let stage: Stage | undefined;
      const stageOrThrow = (): Stage => {
        if (stage === undefined) {
          throw new Error('getStage was never called');
        }
        return stage;
      };

      /**
       * Harness owning the shapes as React state so that the test can push a
       * new prop value into the same mounted viewer instead of remounting.
       */
      const ShapesHarness = (): React.JSX.Element => {
        const [shapes, setShapes] = useState(dummyShapes.slice(0, 2));
        return (
          <>
            <button
              data-cy="add-shapes"
              onClick={() => {
                setShapes(dummyShapes);
              }}
            >
              add shapes
            </button>
            <lib.AnnotationViewer
              id={containerId}
              data={{ image: dummyImage, shapes }}
              style={CONTAINER_STYLE}
              getStage={(value) => {
                stage = value;
              }}
            />
          </>
        );
      };

      cy.mount(<ShapesHarness />);
      waitForShapes(stageOrThrow, 2);
      cy.wrap(null).then(() => {
        const initialStage = stageOrThrow();
        cy.get('[data-cy="add-shapes"]').click();
        waitForShapes(stageOrThrow, dummyShapes.length);
        cy.wrap(null).should(() => {
          expect(stageOrThrow()).to.equal(initialStage);
        });
      });
    });
  });

  it('fires enter, click and leave callbacks with the matching shape', () => {
    const onShapeClick = cy.spy().as('onShapeClick');
    const onShapeMouseEnter = cy.spy().as('onShapeMouseEnter');
    const onShapeMouseLeave = cy.spy().as('onShapeMouseLeave');
    loadDist().then((lib) => {
      mountViewer(lib, {
        onShapeClick,
        onShapeMouseEnter,
        onShapeMouseLeave,
      }).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
      });
    });

    cy.get(`#${containerId} .konvajs-content`).trigger(
      'mousemove',
      SHAPE_HIT.x,
      SHAPE_HIT.y,
    );
    cy.get('@onShapeMouseEnter').should(
      'have.been.calledOnceWith',
      dummyShapes[1],
    );

    cy.get(`#${containerId}`).click(SHAPE_HIT.x, SHAPE_HIT.y);
    cy.get('@onShapeClick').should('have.been.calledOnceWith', dummyShapes[1]);

    cy.get(`#${containerId} .konvajs-content`).trigger(
      'mousemove',
      EMPTY_AREA.x,
      EMPTY_AREA.y,
    );
    cy.get('@onShapeMouseLeave').should(
      'have.been.calledOnceWith',
      dummyShapes[1],
    );
  });

  it('reports relative pointer positions within [0, 1] while hovering the image', () => {
    const getPointerPosition = cy.spy().as('getPointerPosition');
    loadDist().then((lib) => {
      mountViewer(lib, { getPointerPosition }).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
      });
    });
    cy.get(`#${containerId} .konvajs-content`).trigger(
      'mousemove',
      SHAPE_HIT.x,
      SHAPE_HIT.y,
    );
    cy.get<sinon.SinonSpy>('@getPointerPosition').should((spy) => {
      expect(spy.called).to.equal(true);
      const { x, y } = spy.lastCall.args[0] as { x: number; y: number };
      expect(x).to.be.within(0, 1);
      expect(y).to.be.within(0, 1);
    });
  });

  it('does not create a selection rectangle unless enableSelection is set', () => {
    loadDist().then((lib) => {
      mountViewer(lib).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
        cy.get(`#${containerId}`)
          .children()
          .trigger('keydown', { altKey: true, ctrlKey: true })
          .trigger('mousedown', { which: 1, clientX: 10, clientY: 10 })
          .trigger('mousemove', { which: 1, clientX: 600, clientY: 300 });
        cy.wrap(null).should(() => {
          expect(stage().find('Rect')).to.have.length(0);
        });
        cy.get(`#${containerId}`)
          .trigger('mouseup')
          .trigger('keyup', { altKey: true, ctrlKey: true });
      });
    });
  });

  it('reports the shapes enclosed by a selection rectangle when enableSelection is set', () => {
    const onShapeMultiSelect = cy.spy().as('onShapeMultiSelect');
    loadDist().then((lib) => {
      mountViewer(lib, {
        options: { enableSelection: true },
        onShapeMultiSelect,
      }).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
      });
    });
    cy.get(`#${containerId}`)
      .children()
      .trigger('keydown', { altKey: true, ctrlKey: true })
      .trigger('mousedown', { which: 1, clientX: 10, clientY: 10 })
      .trigger('mousemove', { which: 1, clientX: 600, clientY: 300 });
    cy.get(`#${containerId}`)
      .trigger('mouseup')
      .trigger('keyup', { altKey: true, ctrlKey: true });
    cy.get('@onShapeMultiSelect').should(
      'have.been.calledOnceWithExactly',
      dummyShapes.slice(0, 2),
    );
  });

  it('zooms in on wheel up, exposes the level through getZoomScale and respects the max', () => {
    loadDist().then((lib) => {
      mountViewer(lib, {
        options: { zoom: { modifier: 1.5, max: 2, defaultZoom: 1 } },
      }).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
        cy.wrap(null).should(() => {
          expect(lib.getZoomScale(stage())).to.equal(1);
        });
        cy.get(`#${containerId}`).trigger('wheel', { deltaY: -60 });
        cy.wrap(null).should(() => {
          expect(lib.getZoomScale(stage())).to.be.closeTo(1.5, 0.01);
        });
        cy.get(`#${containerId}`)
          .trigger('wheel', { deltaY: -60 })
          .trigger('wheel', { deltaY: -60 });
        cy.wrap(null).should(() => {
          expect(lib.getZoomScale(stage())).to.be.at.most(2);
        });
        cy.get(`#${containerId}`).trigger('wheel', { deltaY: 60 });
        cy.wrap(null).should(() => {
          expect(lib.getZoomScale(stage())).to.be.lessThan(2);
        });
      });
    });
  });

  it('applies customZoomLevel on mount', () => {
    loadDist().then((lib) => {
      mountViewer(lib, { customZoomLevel: 1.75 }).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
        cy.wrap(null).should(() => {
          expect(lib.getZoomScale(stage())).to.be.closeTo(1.75, 0.01);
        });
      });
    });
  });

  it('swaps the displayed image aspect ratio for a 90 degree orientation', () => {
    const imageRatio = (stage: Stage): number => {
      const image = stage.findOne('Image');
      if (image === undefined) {
        throw new Error('No image node on stage');
      }
      return image.width() / image.height();
    };
    loadDist().then((lib) => {
      let uprightRatio = 0;
      mountViewer(lib, { orientation: 0 }).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
        cy.wrap(null).should(() => {
          uprightRatio = imageRatio(stage());
          expect(uprightRatio).to.be.greaterThan(0);
        });
      });
      mountViewer(lib, { orientation: 90 }).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
        cy.wrap(null).should(() => {
          expect(imageRatio(stage())).to.be.closeTo(1 / uprightRatio, 0.05);
        });
      });
    });
  });

  it('lets consumers restyle shapes through setShapeConfig, drawShape and drawShapes', () => {
    loadDist().then((lib) => {
      mountViewer(lib).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
        cy.wrap(null).then(() => {
          const target = dummyShapes[0];
          if (target === undefined) {
            throw new Error('Missing fixture shape');
          }
          lib.setShapeConfig(stage(), target.id, { stroke: 'green' });
          expect(stage().findOne<Line>(`#${target.id}`)?.stroke()).to.equal(
            'green',
          );

          lib.drawShape(stage(), target.id, { stroke: 'blue' });
          expect(stage().findOne<Line>(`#${target.id}`)?.stroke()).to.equal(
            'blue',
          );

          lib.drawShapes(stage(), { strokeWidth: 7 });
          stage()
            .find<Line>('Line')
            .forEach((line) => {
              expect(line.strokeWidth()).to.equal(7);
            });
        });
      });
    });
  });

  it('logs an error rather than throwing when styling an unknown shape id', () => {
    loadDist().then((lib) => {
      mountViewer(lib).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
        cy.window().then((win) => {
          const consoleError = cy.spy(win.console, 'error');
          lib.setShapeConfig(stage(), 'does-not-exist', { stroke: 'red' });
          lib.drawShape(stage(), 'does-not-exist', { stroke: 'red' });
          expect(consoleError.callCount).to.equal(2);
        });
      });
    });
  });

  it('warns and skips malformed coordinates instead of breaking the whole layer', () => {
    const malformed: AnnotationShape = {
      id: 'malformed',
      coordinates: [[0.1, 0.1], [0.2], [0.2, 0.2, 0.3], [0.1, 0.2]],
    };
    loadDist().then((lib) => {
      cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarn');
      });
      mountViewer(lib, { shapes: [...dummyShapes, malformed] }).then(
        ({ stage }) => {
          waitForShapes(stage, dummyShapes.length + 1);
          cy.get('@consoleWarn').should('have.been.called');
        },
      );
    });
  });

  it('removes its canvases from the DOM on unmount', () => {
    loadDist().then((lib) => {
      mountViewer(lib).then(({ stage }) => {
        waitForShapes(stage, dummyShapes.length);
      });
      cy.mount(<div data-cy="placeholder" />);
      cy.get('[data-cy="placeholder"]').should('exist');
      cy.get('canvas').should('have.length', 0);
    });
  });
});
