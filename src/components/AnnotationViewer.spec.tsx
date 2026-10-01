import React, { useState } from 'react';
import anotherDummyImage from 'cypress/assets/another-demo.jpg';
import dummyImageHEIC from 'cypress/assets/demo.heic';
import dummyImage from 'cypress/assets/demo.jpg';
import dummyImageTIFF from 'cypress/assets/demo.tiff';
import { dummyShapes } from 'cypress/assets/shapes';
import Konva from 'konva';

import { KonvaRefs } from '@/common/constants';
import type { AnnotationData } from '@/common/types';

import AnnotationViewer from './AnnotationViewer';

const dummyImageURL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/1280px-ReceiptSwiss.jpg';

const CONTAINER_HEIGHT = 800;
const CONTAINER_WIDTH = 700;
const containerId = 'annotationViewer';
export const AnnotationViewerStateTester = ({
  containerHeight,
  containerWidth,
  id = containerId,
}: {
  containerWidth: number;
  containerHeight: number;
  id?: string;
}) => {
  const [data, setData] = useState<AnnotationData>({
    image: dummyImage,
    shapes: dummyShapes,
  });

  const passSameData = () => {
    setData({ image: dummyImage, shapes: dummyShapes });
  };
  const passDifferentImage = () => {
    setData({ image: anotherDummyImage, shapes: dummyShapes });
  };
  const passDifferentShapes = () => {
    setData({ image: dummyImage, shapes: dummyShapes.slice(3) });
  };
  const passDifferentOrientation = () => {
    setData({ image: dummyImage, shapes: dummyShapes, orientation: 90 });
  };

  const passEmptyImage = () => {
    setData({ shapes: dummyShapes });
  };

  return (
    <div
      data-cy="AnnotationViewerTester"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <button data-cy="same-data" onClick={passSameData}>
        Pass same data
      </button>
      <button data-cy="different-image" onClick={passDifferentImage}>
        Pass different Image
      </button>
      <button data-cy="different-shapes" onClick={passDifferentShapes}>
        Pass different shapes
      </button>
      <button
        data-cy="different-orientation"
        onClick={passDifferentOrientation}
      >
        Pass different orientation
      </button>
      <button data-cy="empty-image" onClick={passEmptyImage}>
        Pass empty image
      </button>
      <AnnotationViewer
        id={id}
        data={data}
        style={{
          height: containerHeight,
          width: containerWidth,
          background: 'black',
        }}
      />
    </div>
  );
};

describe('AnnotationViewer', () => {
  it('shows an JPG image in the canvas', () => {
    cy.mount(
      <AnnotationViewer
        id={containerId}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
      />,
    );
    cy.get(`#${containerId}`).should('be.visible');
    cy.wait(1000);
    cy.get('canvas')
      .should('have.length', 2)
      .each(($canvas) => {
        const canvasWidth = $canvas.width();
        const canvasHeight = $canvas.height();
        cy.wrap(canvasWidth).should('equal', CONTAINER_WIDTH);
        cy.wrap(canvasHeight).should('equal', CONTAINER_HEIGHT);
      });
    cy.get(`#${containerId}`).matchImageSnapshot('jpg.file');
  });
  it('shows a TIFF image in the canvas', () => {
    cy.mount(
      <AnnotationViewer
        id={containerId}
        data={{ image: dummyImageTIFF, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
      />,
    );
    cy.get(`#${containerId}`).should('be.visible');
    cy.wait(1000);
    cy.get('canvas')
      .should('have.length', 2)
      .each(($canvas) => {
        const canvasWidth = $canvas.width();
        const canvasHeight = $canvas.height();
        cy.wrap(canvasWidth).should('equal', CONTAINER_WIDTH);
        cy.wrap(canvasHeight).should('equal', CONTAINER_HEIGHT);
      });
    cy.get(`#${containerId}`).matchImageSnapshot('tiff.file');
  });
  it('shows a HEIC image in the canvas', () => {
    cy.mount(
      <AnnotationViewer
        id={containerId}
        data={{ image: dummyImageHEIC, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
      />,
    );
    cy.get(`#${containerId}`).should('be.visible');
    cy.wait(1000);
    cy.get('canvas')
      .should('have.length', 2)
      .each(($canvas) => {
        const canvasWidth = $canvas.width();
        const canvasHeight = $canvas.height();
        cy.wrap(canvasWidth).should('equal', CONTAINER_WIDTH);
        cy.wrap(canvasHeight).should('equal', CONTAINER_HEIGHT);
      });
    cy.get(`#${containerId}`).matchImageSnapshot('heic.file');
  });

  it('shows a remote image in the canvas', () => {
    cy.mount(
      <AnnotationViewer
        id={containerId}
        data={{ image: dummyImageURL, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
      />,
    );
    cy.get(`#${containerId}`).should('be.visible');
    cy.wait(1000);
    cy.get('canvas')
      .should('have.length', 2)
      .each(($canvas) => {
        const canvasWidth = $canvas.width();
        const canvasHeight = $canvas.height();
        cy.wrap(canvasWidth).should('equal', CONTAINER_WIDTH);
        cy.wrap(canvasHeight).should('equal', CONTAINER_HEIGHT);
      });
    cy.get(`#${containerId}`).matchImageSnapshot('remote.file');
  });

  it('zoom correctly', () => {
    cy.mount(
      <AnnotationViewer
        id={containerId}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
      />,
    );
    cy.wait(1000);
    cy.get(`#${containerId}`)
      .trigger('wheel', {
        deltaY: -60,
      })
      .trigger('wheel', {
        deltaY: -60,
      })
      .trigger('wheel', {
        deltaY: -60,
      });
    cy.wait(200);
    cy.get(`#${containerId}`).matchImageSnapshot('zoomed');
  });

  it('handle events correctly', () => {
    const onShapeClick = cy.spy().as('onShapeClick');
    const onShapeMouseEnter = cy.spy().as('onShapeMouseEnter');
    const onShapeMouseLeave = cy.spy().as('onShapeMouseLeave');
    cy.mount(
      <AnnotationViewer
        id={containerId}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
        onShapeClick={onShapeClick}
        onShapeMouseEnter={onShapeMouseEnter}
        onShapeMouseLeave={onShapeMouseLeave}
      />,
    );
    cy.wait(1000);

    cy.get(`#${containerId} .konvajs-content`).trigger('mousemove', 350, 50);
    cy.get('@onShapeMouseEnter').should(
      'have.been.calledOnceWith',
      dummyShapes[1],
    );

    cy.get(`#${containerId}`).click(350, 50);
    cy.get('@onShapeClick').should('have.been.calledOnceWith', dummyShapes[1]);

    cy.get(`#${containerId} .konvajs-content`).trigger('mousemove', 10, 10);
    cy.get('@onShapeMouseLeave').should(
      'have.been.calledOnceWith',
      dummyShapes[1],
    );
    cy.get('@onShapeMouseEnter').should('have.been.calledOnce');
    cy.get(`#${containerId}`).matchImageSnapshot('shapeClicked');
  });

  it('support multi selection', () => {
    const onShapeMultiSelectSpy = cy.spy().as('onShapeMultiSelectSpy');

    cy.mount(
      <AnnotationViewer
        options={{
          enableSelection: true,
          selectionRectConfig: {
            stroke: 'green',
          },
        }}
        id={containerId}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
        onShapeMultiSelect={onShapeMultiSelectSpy}
      />,
    ).then(() => {
      cy.get(`#${containerId}`)
        .children()
        .trigger('keydown', { altKey: true, ctrlKey: true })
        .trigger('mousedown', { which: 1, clientX: 10, clientY: 10 })
        .trigger('mousemove', { which: 1, clientX: 600, clientY: 300 })
        .matchImageSnapshot('multi-select');
      cy.get(`#${containerId}`)
        .trigger('mouseup')
        .trigger('keyup', { altKey: true, ctrlKey: true })
        .then(() => {
          cy.wait(200);
          cy.get('@onShapeMultiSelectSpy').should(
            'have.been.calledOnceWithExactly',
            dummyShapes.slice(0, 2),
          );
        });
    });
  });

  it('does not select shapes when enableSelection is not set', () => {
    const onShapeMultiSelectSpy = cy.spy().as('onShapeMultiSelectSpy');
    let stage: Konva.Stage | null = null;

    cy.mount(
      <AnnotationViewer
        id={containerId}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
        onShapeMultiSelect={onShapeMultiSelectSpy}
        getStage={(s) => {
          stage = s;
        }}
      />,
    );
    cy.wait(1000);
    cy.get(`#${containerId}`)
      .children()
      .trigger('keydown', { altKey: true, ctrlKey: true })
      .trigger('mousedown', { which: 1, clientX: 10, clientY: 10 })
      .trigger('mousemove', { which: 1, clientX: 600, clientY: 300 });
    cy.get(`#${containerId}`)
      .trigger('mouseup')
      .trigger('keyup', { altKey: true, ctrlKey: true });
    cy.wait(200);
    cy.get('@onShapeMultiSelectSpy')
      .should('not.have.been.called')
      .then(() => {
        const shapesLayer = stage?.findOne(`#${KonvaRefs.ShapesLayer}`);
        expect(shapesLayer).to.be.instanceOf(Konva.Layer);
        expect((shapesLayer as Konva.Layer).find('Rect')).to.have.length(0);
        expect((shapesLayer as Konva.Layer).find('Line')).to.have.length(
          dummyShapes.length,
        );
      });
  });

  it('support custom options', () => {
    const [firstShape] = dummyShapes;
    if (!firstShape) {
      throw new Error('fixture has no shapes');
    }
    firstShape.config = { fill: 'green', opacity: 0.2 };
    cy.mount(
      <AnnotationViewer
        options={{
          shapeConfig: { fill: 'blue', opacity: 0.2 },
        }}
        id={containerId}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}
      />,
    ).then(() => {
      cy.wait(200);
      cy.get(`#${containerId}`).matchImageSnapshot('custom-options');
    });
  });

  //   it.only('support custom zoom level', () => {
  //     dummyShapes[0].config = { fill: 'green', opacity: 0.2 }
  //     cy.mount(
  //       <AnnotationViewer
  //         id={containerId}
  //         data={{ image: dummyImage, shapes: dummyShapes }}
  //         style={{ height: containerHeight, width: containerWidth }}
  //         customZoomLevel={2}
  //       />,
  //     ).then(() => {
  //       cy.wait(800)
  //       cy.get(`#${containerId}`).matchImageSnapshot('custom-zoom-level')
  //     })
  //   })

  it('support state changes', () => {
    cy.mount(
      <AnnotationViewerStateTester
        id={containerId}
        containerHeight={CONTAINER_HEIGHT}
        containerWidth={CONTAINER_WIDTH}
      />,
    ).then(() => {
      cy.get('[data-cy="same-data"]').click();
      cy.wait(400);
      cy.get(`#${containerId}`).matchImageSnapshot('same-data');
      cy.get('[data-cy="different-image"]').click();
      cy.wait(400);
      cy.get(`#${containerId}`).matchImageSnapshot('different-image');
      cy.get('[data-cy="different-shapes"]').click();
      cy.wait(400);
      cy.get(`#${containerId}`).matchImageSnapshot('different-shapes');
      cy.get('[data-cy="different-orientation"]').click();
      cy.wait(400);
      cy.get(`#${containerId}`).matchImageSnapshot('different-orientation');
    });
  });
});
