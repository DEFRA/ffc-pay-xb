jest.mock('../../app/messaging')
const { start: mockStartMessaging } = require('../../app/messaging')

describe('app start', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts messaging', async () => {
    expect(mockStartMessaging).toHaveBeenCalledTimes(1)
  })
})
