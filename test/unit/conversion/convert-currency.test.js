const {
  convertToPence,
  convertToPounds
} = require('../../../app/conversion/currency-convert')

describe('convert currency', () => {
  describe('convertToPence', () => {
    test.each([
      [100, 10000],
      [100.10, 10010],
      [100.1, 10010],
      ['100', 10000],
      ['100.10', 10010],
      ['100.1', 10010]
    ])('converts %s to %s pence', (input, expected) => {
      expect(convertToPence(input)).toBe(expected)
    })
  })

  describe('convertToPounds', () => {
    test.each([
      [10000, '100.00'],
      [10010, '100.10']
    ])('converts %s to %s pounds', (input, expected) => {
      expect(convertToPounds(input)).toBe(expected)
    })
  })
})
