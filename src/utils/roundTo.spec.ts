import { roundTo } from '@/utils/roundTo'

describe('roundTo', () => {
  it('should round to the correct precision', () => {
    const value = 1.23456789
    const precision = 2

    const expected = 1.23
    const actual = roundTo(value, precision)

    expect(actual).to.equal(expected)
  })

  it('should round to the correct precision with negative number', () => {
    const value = -1.23456789
    const precision = 2

    const expected = -1.23
    const actual = roundTo(value, precision)

    expect(actual).to.equal(expected)
  })

  it('should round to the correct precision with integer', () => {
    const value = 1.5
    const precision = 0

    const expected = 2
    const actual = roundTo(value, precision)

    expect(actual).to.equal(expected)
  })
})
