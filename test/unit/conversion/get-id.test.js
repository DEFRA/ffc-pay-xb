const { getId } = require('../../../app/conversion/get-id')

describe('get id', () => {
  test('should return id prefixed with 9', () => {
    const id = 1
    const result = getId(id)
    expect(result.toString()[0]).toBe('9')
  })

  test.each([
    [1, '900000001'],
    [10, '900000010'],
    [100, '900000100'],
    [1000, '900001000'],
    [10000, '900010000'],
    [100000, '900100000'],
    [1000000, '901000000'],
    [10000000, '910000000']
  ])('should return id padded with 8 0s when id is 1 digit', (paymentRequestId, expectedId) => {
    const result = getId(paymentRequestId)
    expect(result).toBe(expectedId)
  })
})
