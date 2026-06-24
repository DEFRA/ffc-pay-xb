jest.useFakeTimers()
jest.mock('../../../app/responses/process-responses')

// Mock config with responseConfig
const mockResponseConfig = {
  active: true,
  responseInterval: 60000
}

jest.mock('../../../app/config', () => ({
  responseConfig: mockResponseConfig
}))

const { start } = require('../../../app/responses/start')
const { processResponses } = require('../../../app/responses/process-responses')

describe('responses start', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    jest.clearAllTimers()
    mockResponseConfig.active = true
    mockResponseConfig.responseInterval = 60000
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    processResponses.mockClear()
  })

  test('starts processing when active', async () => {
    processResponses.mockResolvedValue(undefined)

    await start()

    expect(processResponses).toHaveBeenCalledTimes(1)
  })

  test('schedules next start with responseInterval when active', async () => {
    processResponses.mockResolvedValue(undefined)

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    await start()

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 60000)
    setTimeoutSpy.mockRestore()
  })

  test('does not process responses when inactive', async () => {
    mockResponseConfig.active = false

    await start()

    expect(processResponses).not.toHaveBeenCalled()
  })

  test('logs error when processResponses fails', async () => {
    const testError = new Error('Test error')
    processResponses.mockRejectedValue(testError)

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    await start()

    expect(consoleErrorSpy).toHaveBeenCalledWith(testError)
    expect(setTimeoutSpy).toHaveBeenCalled()
    setTimeoutSpy.mockRestore()
  })

  test('schedules retry even when processResponses throws', async () => {
    mockResponseConfig.responseInterval = 5000
    processResponses.mockRejectedValue(new Error('Process error'))

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    await start()

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000)
    setTimeoutSpy.mockRestore()
  })

  test('uses custom responseInterval value', async () => {
    mockResponseConfig.responseInterval = 30000
    processResponses.mockResolvedValue(undefined)

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    await start()

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 30000)
    setTimeoutSpy.mockRestore()
  })
})
