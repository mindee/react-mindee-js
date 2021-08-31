import React from 'react'
import { mount } from '@cypress/react'

import {
  AnnotationLensPointerPositionTester,
  AnnotationLensStateTester,
} from './helpers'

const containerHeight = 600
const containerWidth = 600

describe('AnnotationLens', () => {
  const componentId = 'annotationLens'
  it('mount correctly', () => {
    mount(
      <AnnotationLensPointerPositionTester
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        id={componentId}
      />
    ).then(() => {
      cy.wait(500)
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
            componentId + '.pointer-move.1'
          )
        })

      cy.get('[data-cy="move-pointer"]')
        .click()
        .then(() => {
          cy.get(`#${componentId}`).matchImageSnapshot(
            componentId + '.pointer-move.2'
          )
        })
      cy.get('[data-cy="move-pointer"]')
        .click()
        .then(() => {
          cy.get(`#${componentId}`).matchImageSnapshot(
            componentId + '.pointer-move.3'
          )
        })
    })
  })

  it('support state changes', () => {
    mount(
      <AnnotationLensStateTester
        id={componentId}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
      />
    ).then(() => {
      cy.get('[data-cy="same-data"]').click()
      cy.wait(400)
      cy.get(`#${componentId}`).matchImageSnapshot('annotationLens.same-data')
      cy.get('[data-cy="different-image"]').click()
      cy.wait(400)
      cy.get(`#${componentId}`).matchImageSnapshot(
        'annotationLens.different-image'
      )
      cy.get('[data-cy="different-shapes"]').click()
      cy.wait(400)
      cy.get(`#${componentId}`).matchImageSnapshot(
        'annotationLens.different-shapes'
      )
      cy.get('[data-cy="different-orientation"]').click()
      cy.wait(400)
      cy.get(`#${componentId}`).matchImageSnapshot(
        'annotationLens.different-orientation'
      )
    })
  })
})
