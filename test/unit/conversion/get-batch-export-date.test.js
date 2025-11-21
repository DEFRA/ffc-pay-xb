jest.useFakeTimers()
jest.setSystemTime(new Date(2023, 0, 1))

const { getBatchExportDate } = require('../../../app/conversion/get-batch-export-date')

describe('get batch export date', () => {
  test.each([
    ['SITI_0001_AP_202310161303123.dat', '2023-10-16'],
    ['SITI_0001_AP.dat', '2023-01-01'],
    ['SITI_0001_AP_202342161303123.dat', '2023-01-01']
  ])('extracts export date from %s → %s', (batch, expected) => {
    expect(getBatchExportDate(batch)).toBe(expected)
  })
})
