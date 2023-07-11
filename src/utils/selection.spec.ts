import { Stage } from 'konva/lib/Stage'

import { calculateSelectionPoint } from '@/utils/selection'

describe('selection', () => {
  describe('calculateSelectionPoint', () => {
    it('should return the correct position', () => {
      const stage = {
        position: () => ({ x: 50, y: 0 }),
        getPointerPosition: () => ({ x: 2, y: 2 }),
        scaleX: () => 0.781,
      }

      const expected = { x: -61.46, y: 2.56 }
      const actual = calculateSelectionPoint(stage as Stage)

      expect(actual).to.deep.equal(expected)
    })

    it('should return undefined if pointerPosition is null', () => {
      const stage = {
        position: () => ({ x: 50, y: 0 }),
        getPointerPosition: () => null,
        scaleX: () => 0.781,
      }

      const expected = undefined
      const actual = calculateSelectionPoint(stage as Stage)

      expect(actual).to.deep.equal(expected)
    })
  })
})
