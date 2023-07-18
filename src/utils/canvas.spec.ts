import { Stage } from 'konva/lib/Stage'

import { ImageBoundingBox } from '@/common/types'

import { getMousePosition, scalePointToImage } from '@/utils/canvas'

describe('canvas', () => {
  describe('scalePointToImage', () => {
    it('should scale the point to the image', () => {
      const point = { x: 0.5, y: 0.5 }
      const imageBoundingBox = {
        x: 50,
        y: 0,
        width: 600,
        height: 800,
        scale: 0.781,
      }

      const expected = { x: 384.12, y: 512.16 }

      const actual = scalePointToImage(point, imageBoundingBox)

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('getMousePosition', () => {
    it('should return the correct mouse position', () => {
      const stage = {
        getPointerPosition: () => ({ x: 100, y: 200 }),
        scaleX: () => 1,
        x: () => 0,
        y: () => 0,
      }

      const imageBoundingBox = {
        x: 50,
        y: 0,
        width: 600,
        height: 800,
        scale: 1.5,
      }

      const expected = { x: 0.25, y: 0.38 }

      const actual = getMousePosition(
        stage as unknown as Stage,
        imageBoundingBox as ImageBoundingBox,
      )

      expect(actual).to.deep.equal(expected)
    })

    it('should do nothing if stage or imageBoundingBox are null', () => {
      const expected = undefined

      {
        const actual = getMousePosition({} as Stage, null)
        expect(actual).to.equal(expected)
      }

      {
        const actual = getMousePosition(null, {} as ImageBoundingBox)
        expect(actual).to.equal(expected)
      }
    })
  })
})
