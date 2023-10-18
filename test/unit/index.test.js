jest.mock('../../app/messaging')
const { start: mockStartMessaging } = require('../../app/messaging')
const { start: mockStartResponses } = require('../../app/responses')

describe('app start', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts messaging', async () => {
    expect(mockStartMessaging).toHaveBeenCalledTimes(1)
  })

  test('starts responses', async () => {
    expect(mockStartResponses).toHaveBeenCalledTimes(1)
  })
})
