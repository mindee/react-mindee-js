import dummyImage from 'cypress/assets/demo.jpg';
import { dummyShapes } from 'cypress/assets/shapes';
import type { Stage } from 'konva/lib/Stage';

import { CONTAINER_STYLE, loadDist, type DistLibrary } from './helpers';

const containerId = 'annotationLens';

const mountLens = (
  lib: DistLibrary,
  props: {
    zoomLevel?: number;
    pointerPosition?: { x: number; y: number };
  } = {},
): Cypress.Chainable<() => Stage> => {
  let stage: Stage | undefined;
  return cy
    .mount(
      <lib.AnnotationLens
        id={containerId}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={CONTAINER_STYLE}
        getStage={(value) => {
          stage = value;
        }}
        {...props}
      />,
    )
    .then(() => {
      cy.get(`#${containerId} canvas`).should('have.length.at.least', 1);
    })
    .then(() => (): Stage => {
      if (stage === undefined) {
        throw new Error('getStage was never called');
      }
      return stage;
    });
};

describe('built library AnnotationLens', () => {
  it('mounts with the image and every shape drawn', () => {
    loadDist().then((lib) => {
      mountLens(lib).then((stage) => {
        cy.wrap(null).should(() => {
          expect(stage().find('Line')).to.have.length(dummyShapes.length);
          expect(stage().findOne('Image')).to.not.equal(undefined);
        });
      });
    });
  });

  it('scales the stage by the requested zoomLevel', () => {
    loadDist().then((lib) => {
      mountLens(lib, { zoomLevel: 2.5 }).then((stage) => {
        cy.wrap(null).should(() => {
          expect(stage().scaleX()).to.be.closeTo(2.5, 0.001);
          expect(stage().scaleY()).to.be.closeTo(2.5, 0.001);
        });
      });
    });
  });

  it('moves the stage when the pointer position changes', () => {
    loadDist().then((lib) => {
      let initialPosition = { x: 0, y: 0 };
      mountLens(lib, { pointerPosition: { x: 0.2, y: 0.2 } }).then((stage) => {
        cy.wrap(null).should(() => {
          initialPosition = stage().position();
        });
      });
      mountLens(lib, { pointerPosition: { x: 0.8, y: 0.8 } }).then((stage) => {
        cy.wrap(null).should(() => {
          const position = stage().position();
          expect(position.x).to.not.equal(initialPosition.x);
          expect(position.y).to.not.equal(initialPosition.y);
        });
      });
    });
  });
});
