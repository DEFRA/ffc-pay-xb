const { getBatchId } = require('../../../app/conversion/get-batch-id')

describe('get batch id', () => {
  test.each([
    ['SITI_0001_AP_1234.dat', 1],
    ['SITI_0010_AP_1234.dat', 10],
    ['SITI_0100_AP_1234.dat', 100],
    ['SITI_1000_AP_1234.dat', 1000],
    ['SITI_AP_1234.dat', 1]
  ])('returns %s → %s', (filename, expected) => {
    expect(getBatchId(filename)).toBe(expected)
  })
})
