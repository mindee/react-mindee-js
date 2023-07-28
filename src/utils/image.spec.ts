import { Stage } from 'konva/lib/Stage'

import { ImageBoundingBox } from '@/common/types'

import {
  computeImageBoundingBox,
  setStageBasedImagePosition,
} from '@/utils/image'

describe('image', () => {
  describe('computeImageBoundingBox', () => {
    it('should return the correct bounding box', () => {
      const htmlDivElement = { clientWidth: 700, clientHeight: 800 }
      const htmlImageElement = { width: 768, height: 1024 }

      const expected = {
        x: 50,
        y: 0,
        width: 600,
        height: 800,
        scale: 0.781,
      }

      const actual = computeImageBoundingBox(
        htmlDivElement as HTMLDivElement,
        htmlImageElement as HTMLImageElement,
      )

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('setStageBasedImagePosition', () => {
    it('should set the correct bounding box', () => {
      const imageBoundingBox = { x: 50, y: 0, width: 600, height: 800 }
      const pointerPosition = { x: 25, y: 25 }

      const stage = {
        getAttr: () => 1,
        x: () => 0,
        y: () => 0,
        width: () => 700,
        height: () => 800,
        position: cy.spy().as('stagePositionSpy'),
        batchDraw: cy.spy(),
      }

      const expected = { x: 25, y: 0 }

      setStageBasedImagePosition({
        imageBoundingBox: imageBoundingBox as ImageBoundingBox,
        stage: stage as unknown as Stage,
        newPosition: pointerPosition,
      })

      cy.get('@stagePositionSpy').should('be.calledWithExactly', expected)
    })
  })
})
