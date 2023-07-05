import React, { useState } from 'react'
import anotherDummyImage from 'cypress/assets/another-demo.jpg'
import dummyImage from 'cypress/assets/demo.jpg'
import { dummyShapes } from 'cypress/assets/shapes'

import { AnnotationData } from '@/common/types'

import AnnotationLens from './AnnotationLens'

const containerHeight = 600
const containerWidth = 600

type TesterProps = {
  containerWidth: number
  containerHeight: number
  id?: string
}

export const AnnotationLensPointerPositionTester = ({
  id = 'annotationLens',
  containerHeight,
  containerWidth,
}: TesterProps) => {
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 })

  const onMove = () => {
    setPointerPosition((pointerPosition) => ({
      x: pointerPosition.x + 0.2,
      y: pointerPosition.y + 0.2,
    }))
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button data-cy="move-pointer" onClick={onMove}>
        Move pointer position
      </button>
      <AnnotationLens
        id={id}
        pointerPosition={pointerPosition}
        data={{ image: dummyImage, shapes: dummyShapes }}
        style={{ height: containerHeight, width: containerWidth }}
      />
    </div>
  )
}

export const AnnotationLensStateTester = ({
  containerHeight,
  containerWidth,
  id = 'annotationLens',
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
      <AnnotationLens
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

describe('AnnotationLens', () => {
  const componentId = 'annotationLens'
  it('mount correctly', () => {
    cy.mount(
      <AnnotationLensPointerPositionTester
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        id={componentId}
      />,
    ).then(() => {
      cy.wait(500)
      cy.pause()
      cy.get('canvas')
        .should('have.length', 2)
        .each(($canvas) => {
          const canvasWidth = $canvas.width()
          const canvasHeight = $canvas.height()
          cy.wrap(canvasWidth).should('equal', containerWidth)
          cy.wrap(canvasHeight).should('equal', containerHeight)
        })
      cy.get(`#${componentId}`).matchImageSnapshot(componentId + '.default')
      cy.get('[data-cy="move-pointer"]')
        .click()
        .then(() => {
          cy.get(`#${componentId}`).matchImageSnapshot(
            componentId + '.pointer-move.1',
          )
        })

      cy.get('[data-cy="move-pointer"]')
        .click()
        .then(() => {
          cy.get(`#${componentId}`).matchImageSnapshot(
            componentId + '.pointer-move.2',
          )
        })
      cy.get('[data-cy="move-pointer"]')
        .click()
        .then(() => {
          cy.get(`#${componentId}`).matchImageSnapshot(
            componentId + '.pointer-move.3',
          )
        })
    })
  })

  it('support state changes', () => {
    cy.mount(
      <AnnotationLensStateTester
        id={componentId}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
      />,
    ).then(() => {
      cy.get('[data-cy="same-data"]').click()
      cy.wait(400)
      cy.get(`#${componentId}`).matchImageSnapshot('annotationLens.same-data')
      cy.get('[data-cy="different-image"]').click()
      cy.wait(400)
      cy.get(`#${componentId}`).matchImageSnapshot(
        'annotationLens.different-image',
      )
      cy.get('[data-cy="different-shapes"]').click()
      cy.wait(400)
      cy.get(`#${componentId}`).matchImageSnapshot(
        'annotationLens.different-shapes',
      )
      cy.get('[data-cy="different-orientation"]').click()
      cy.wait(400)
      cy.get(`#${componentId}`).matchImageSnapshot(
        'annotationLens.different-orientation',
      )
    })
  })
})
