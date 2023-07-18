import Konva from 'konva'

import {
  calculateLensZoom,
  calculateStageZoom,
  calculateZoomScale,
} from '@/utils/zoom'

import { AnnotationViewerOptions } from '..'

describe('zoom', () => {
  describe('calculateLensZoom', () => {
    it('should return the correct position', () => {
      const pointerPosition = { x: 0.5, y: 0.5 }
      const imageBoundingBox = {
        x: 0,
        y: 75,
        width: 600,
        height: 450,
        scale: 0.586,
      }
      const stage = { width: () => 600, height: () => 600 }
      const zoomLevel = 1.5

      const expected = { x: -467.92, y: -275.94 }

      const actual = calculateLensZoom(
        pointerPosition,
        imageBoundingBox,
        stage as Konva.Stage,
        zoomLevel,
      )

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('calculateStageZoom', () => {
    it('should return the correct scale and position', () => {
      const stage = {
        scaleX: () => 1.12464,
        position: () => ({ x: -82, y: -176 }),
        getPointerPosition: () => ({ x: 350, y: 400 }),
      }
      const deltaY = -60
      const options = { zoom: { modifier: 1.2 } }

      const expected = {
        newScale: 1.35,
        newPos: { x: -168.4, y: -291.2 },
      }

      const actual = calculateStageZoom(
        stage as Konva.Stage,
        deltaY,
        options as AnnotationViewerOptions,
      )

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('calculateZoomScale', () => {
    it('should return the correct scale and position', () => {
      const stage = {
        scaleX: () => 1.12464,
        position: () => ({ x: -82, y: -176 }),
        getPointerPosition: () => ({ x: 350, y: 400 }),
      }
      const imageBoundingBox = {
        x: 0,
        y: 75,
        width: 600,
        height: 450,
        scale: 0.586,
      }
      const deltaY = -60

      const expected = {
        newScale: -35.16,
        newPos: { x: 12242.59, y: 15181.35 },
      }

      const actual = calculateZoomScale(
        stage as Konva.Stage,
        deltaY,
        imageBoundingBox,
      )

      expect(actual).to.deep.equal(expected)
    })
  })
})
