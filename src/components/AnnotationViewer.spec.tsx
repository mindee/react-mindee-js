import React, { useState } from 'react'
import anotherDummyImage from 'cypress/assets/another-demo.jpg'
import dummyImage from 'cypress/assets/demo.jpg'

import { AnnotationData, AnnotationShape } from '@/common/types'

import { dummyShapes } from '../../cypress/assets/shapes'
import AnnotationViewer from './AnnotationViewer'

const containerHeight = 800
const containerWidth = 700
type TesterProps = {
  containerWidth: number
  containerHeight: number
  id?: string
}
export const AnnotationViewerStateTester = ({
  containerHeight,
  containerWidth,
  id = 'AnnotationViewer',
}: TesterProps) => {
  const [data, setData] = useState<AnnotationData>({
    image: dummyImage,
    shapes: dummyShapes,
  })

  const passSameData = () => {
    setData({ image: dummyImage, shapes: dummyShapes })
  }
  const passDifferentImage = () => {
    setData({ image: anotherDummyImage, shapes: dummyShapes })
  }
  const passDifferentShapes = () => {
    setData({ image: dummyImage, shapes: dummyShapes.slice(3) })
  }
  const passDifferentOrientation = () => {
    setData({ image: dummyImage, shapes: dummyShapes, orientation: 90 })
  }

  const passEmptyImage = () => {
    setData({ shapes: dummyShapes })
  }

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
  )
}

describe('AnnotationViewer', () => {
  it('mount correctly', () => {
    cy.mount(
      <AnnotationViewer
        onShapeClick={console.log}
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
      />,
    )
    cy.wait(1000)
    cy.get('canvas')
      .should('have.length', 2)
      .each(($canvas) => {
        const canvasWidth = $canvas.width()
        const canvasHeight = $canvas.height()
        cy.wrap(canvasWidth).should('equal', containerWidth)
        cy.wrap(canvasHeight).should('equal', containerHeight)
      })
    cy.get('#annotationViewer').matchImageSnapshot('default')
  })

  it('zoom correctly', () => {
    cy.mount(
      <AnnotationViewer
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
      />,
    )
    cy.wait(1000)
    cy.get('#annotationViewer')
      .trigger('wheel', {
        deltaY: -60,
      })
      .trigger('wheel', {
        deltaY: -60,
      })
      .trigger('wheel', {
        deltaY: -60,
      })
    cy.wait(200)
    cy.get('#annotationViewer').matchImageSnapshot('zoomed')
  })

  it('handle events correctly', () => {
    const events = {
      onShapeClick: (shape: AnnotationShape) => {
        console.log(shape)
      },
      onShapeMouseEnter: (shape: AnnotationShape) => {
        console.log(shape)
      },
      onShapeMouseLeave: (shape: AnnotationShape) => {
        console.log(shape)
      },
    }
    const clickSpy = cy.spy(events, 'onShapeClick').withArgs(dummyShapes[1])
    const mouseEnterSpy = cy
      .spy(events, 'onShapeMouseEnter')
      .withArgs(dummyShapes[1])
    const mouseLeaveSpy = cy
      .spy(events, 'onShapeMouseLeave')
      .withArgs(dummyShapes[1])

    cy.mount(
      <AnnotationViewer
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
        {...events}
      />,
      {
        log: true,
      },
    )
    cy.wait(1000)
    cy.get('#annotationViewer')
      .click(350, 50)
      .then(($container) => {
        cy.wait(200)
        cy.wrap($container).matchImageSnapshot('shapeClicked')
        expect(clickSpy).to.be.calledOnce
      })

    it('should handle click event', () => {
      cy.get('#annotationViewer')
        .click(350, 50)
        .then(($container) => {
          cy.wait(200)
          cy.wrap($container).matchImageSnapshot('shapeClicked')
          expect(clickSpy).to.be.calledOnce
        })
    })
    it('should handle mouse enter event', () => {
      cy.get('#annotationViewer')
        .trigger('mouseenter', {
          clientX: 350,
          clientY: 50,
        })
        .then(($container) => {
          cy.wait(200)
          cy.wrap($container).matchImageSnapshot('shapeMouseEnter')
          expect(mouseEnterSpy).to.be.calledOnce
        })
    })
    it('should handle mouse leave event', () => {
      cy.get('#annotationViewer')
        .trigger('mouseleave', 350, 50)
        .then(($container) => {
          cy.wait(200)
          cy.wrap($container).matchImageSnapshot('shapeMouseLeave')
          expect(mouseLeaveSpy).to.be.calledOnce
        })
    })
  })

  it('support multi selection', () => {
    const onShapeMultiSelectSpy = cy.spy().as('onShapeMultiSelectSpy')

    cy.mount(
      <AnnotationViewer
        options={{
          enableSelection: true,
          selectionRectConfig: {
            stroke: 'green',
          },
        }}
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
        onShapeMultiSelect={onShapeMultiSelectSpy}
      />,
    ).then(() => {
      cy.pause()
      cy.get('#annotationViewer')
        .children()
        .trigger('keydown', { altKey: true, ctrlKey: true })
        .trigger('mousedown', { which: 1, clientX: 10, clientY: 10 })
        .trigger('mousemove', { which: 1, clientX: 600, clientY: 300 })
        .matchImageSnapshot('multi-select')
      cy.get('#annotationViewer')
        .trigger('mouseup')
        .trigger('keyup', { altKey: true, ctrlKey: true })
        .then(() => {
          cy.wait(200)
          cy.get('@onShapeMultiSelectSpy').should(
            'have.been.calledOnceWithExactly',
            dummyShapes.slice(0, 2),
          )
        })
    })
  })

  it('support custom options', () => {
    dummyShapes[0].config = { fill: 'green', opacity: 0.2 }
    cy.mount(
      <AnnotationViewer
        options={{
          shapeConfig: { fill: 'blue', opacity: 0.2 },
        }}
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
      />,
    ).then(() => {
      cy.get('#annotationViewer').matchImageSnapshot('custom-options')
    })
  })

  it('support custom zoom level', () => {
    dummyShapes[0].config = { fill: 'green', opacity: 0.2 }
    cy.mount(
      <AnnotationViewer
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
        customZoomLevel={2}
      />,
    ).then(() => {
      cy.get('#annotationViewer').matchImageSnapshot('custom-zoom-level')
    })
  })

  it('support state changes', () => {
    cy.mount(
      <AnnotationViewerStateTester
        id="annotationViewer"
        containerHeight={containerHeight}
        containerWidth={containerWidth}
      />,
    ).then(() => {
      cy.get('[data-cy="same-data"]').click()
      cy.wait(400)
      cy.get('#annotationViewer').matchImageSnapshot('same-data')
      cy.get('[data-cy="different-image"]').click()
      cy.wait(400)
      cy.get('#annotationViewer').matchImageSnapshot('different-image')
      cy.get('[data-cy="different-shapes"]').click()
      cy.wait(400)
      cy.get('#annotationViewer').matchImageSnapshot('different-shapes')
      cy.get('[data-cy="different-orientation"]').click()
      cy.wait(400)
      cy.get('#annotationViewer').matchImageSnapshot('different-orientation')
    })
  })
})
