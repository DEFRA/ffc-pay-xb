describe('application insights', () => {
  const DEFAULT_ENV = process.env
  let applicationInsights

  beforeEach(() => {
    jest.resetModules()
    jest.mock('applicationinsights', () => ({
      setup: jest.fn().mockReturnThis(),
      start: jest.fn(),
      defaultClient: { context: { keys: [], tags: [] } }
    }))
    applicationInsights = require('applicationinsights')
    process.env = { ...DEFAULT_ENV }
  })

  afterAll(() => {
    process.env = DEFAULT_ENV
  })

  const loadInsights = () => require('../../app/insights')

  test.each([
    [undefined, 0],
    ['test-key', 1]
  ])('setup called %s → %s times', (connString, expectedCalls) => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = connString
    const appInsights = loadInsights()
    appInsights.setup()
    expect(applicationInsights.setup).toHaveBeenCalledTimes(expectedCalls)
  })
})
