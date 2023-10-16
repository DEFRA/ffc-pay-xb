jest.useFakeTimers()
jest.setSystemTime(new Date(2023, 0, 1))

const { getBatchExportDate } = require('../../../app/conversion/get-batch-export-date')

describe('get batch export date', () => {
  test('should return batch export date from batch string', () => {
    const batch = 'SITI_0001_AP_202310161303123.dat'
    const result = getBatchExportDate(batch)
    expect(result).toBe('2023-10-16')
  })

  test('should return current date if no batch export date', () => {
    const batch = 'SITI_0001_AP.dat'
    const result = getBatchExportDate(batch)
    expect(result).toBe('2023-01-01')
  })

  test('should return current date if unable to parse batch export date', () => {
    const batch = 'SITI_0001_AP_202342161303123.dat'
    const result = getBatchExportDate(batch)
    expect(result).toBe('2023-01-01')
  })
})
