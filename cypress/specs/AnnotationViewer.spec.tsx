import React from 'react'
import { mount } from '@cypress/react'
import { AnnotationShape, AnnotationViewer } from '../../dist'
import { Key } from 'ts-key-enum'

import dummyImage from '../assets/demo.jpg'
import { dummyShapes } from '../assets/shapes'

import { AnnotationViewerStateTester } from './helpers'

const containerHeight = 800
const containerWidth = 700

describe('AnnotationViewer', () => {
  it('mount correctly', () => {
    mount(
      <AnnotationViewer
        onShapeClick={console.log}
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
      />
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
    cy.pause()
  })

  it('zoom correctly', () => {
    mount(
      <AnnotationViewer
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
      />
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

    mount(
      <AnnotationViewer
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
        {...events}
      />,
      {
        log: true,
      }
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
    const events = {
      onShapeMultiSelect: (shapes: AnnotationShape[]) => {
        console.log(shapes)
      },
    }
    cy.spy(events, 'onShapeMultiSelect')
    mount(
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
        onShapeMultiSelect={events.onShapeMultiSelect}
      />
    ).then(() => {
      cy.get('#annotationViewer')
        .children()
        .trigger('keydown', { key: Key.Control })
        .trigger('mousedown', { which: 1, clientX: 10, clientY: 10 })
        .trigger('mousemove', { which: 1, clientX: 600, clientY: 300 })
        .matchImageSnapshot('multi-select')
      cy.get('#annotationViewer')
        .trigger('mouseup')
        .trigger('keyup', { key: Key.Control })
        .then(() => {
          cy.wait(200)
          expect(events.onShapeMultiSelect).to.be.calledOnceWithExactly(
            dummyShapes.slice(0, 2)
          )
        })
    })
  })

  it('support custom options', () => {
    dummyShapes[0].config = { fill: 'green', opacity: 0.2 }
    mount(
      <AnnotationViewer
        options={{
          shapeConfig: { fill: 'blue', opacity: 0.2 },
        }}
        id="annotationViewer"
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
      />
    ).then(() => {
      cy.get('#annotationViewer').matchImageSnapshot('custom-options')
    })
  })

  it('support state changes', () => {
    mount(
      <AnnotationViewerStateTester
        id="annotationViewer"
        containerHeight={containerHeight}
        containerWidth={containerWidth}
      />
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
