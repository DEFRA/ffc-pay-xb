const { getBatchId } = require('../../../app/conversion/get-batch-id')

describe('get batch id', () => {
  test('should return batch id as number', () => {
    const batch = 'SITI_0001_AP_1234.dat'
    const result = getBatchId(batch)
    expect(result).toBe(1)
  })

  test('should return batch id as number when batch id is 2 digits', () => {
    const batch = 'SITI_0010_AP_1234.dat'
    const result = getBatchId(batch)
    expect(result).toBe(10)
  })

  test('should return batch id as number when batch id is 3 digits', () => {
    const batch = 'SITI_0100_AP_1234.dat'
    const result = getBatchId(batch)
    expect(result).toBe(100)
  })

  test('should return batch id as number when batch id is 4 digits', () => {
    const batch = 'SITI_1000_AP_1234.dat'
    const result = getBatchId(batch)
    expect(result).toBe(1000)
  })

  test('should return batch id as 1 if no batch id', () => {
    const batch = 'SITI_AP_1234.dat'
    const result = getBatchId(batch)
    expect(result).toBe(1)
  })
})
