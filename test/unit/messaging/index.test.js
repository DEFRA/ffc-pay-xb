const { start, stop } = require('../../../app/messaging')
const { MessageReceiver } = require('ffc-messaging')
const { processXbMessage } = require('../../../app/messaging/process-xb-message.js')
const { keepAlive } = jest.requireActual('../../../app/messaging/keep-alive')
const { messageConfig } = require('../../../app/config')

jest.mock('ffc-messaging')
jest.mock('../../../app/messaging/process-xb-message.js')
jest.mock('../../../app/messaging/keep-alive')
jest.mock('../../../app/config')

describe('start and stop functions', () => {
  let consoleLogSpy
  let keepAliveSpy

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    keepAliveSpy = jest.spyOn(require('../../../app/messaging/keep-alive'), 'keepAlive')
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    keepAliveSpy.mockRestore()
  })

  const receiverInstances = []

  test('start function when messageConfig is active', async () => {
    messageConfig.active = true

    MessageReceiver.mockImplementation((_, action) => {
      const instance = {
        subscribe: () => action('mock message'),
        closeConnection: jest.fn()
      }
      receiverInstances.push(instance)
      return instance
    })

    await start()

    expect(MessageReceiver).toHaveBeenCalled()
    expect(processXbMessage).toHaveBeenCalledWith('mock message', expect.anything())
    expect(console.log).toHaveBeenCalledWith('Ready to process Cross Border payment requests')
  })

  test('start function when messageConfig is not active', async () => {
    messageConfig.active = false
    await start()
    expect(keepAliveSpy).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('Cross Border adapter is not active')
  })

  test('stop function when receiver is defined', async () => {
    messageConfig.active = true

    MessageReceiver.mockImplementation(() => {
      const instance = {
        subscribe: jest.fn(),
        closeConnection: jest.fn()
      }
      receiverInstances.push(instance)
      return instance
    })

    await start()

    const receiver = receiverInstances[receiverInstances.length - 1]
    const closeConnectionSpy = jest.spyOn(receiver, 'closeConnection')

    await stop()

    expect(closeConnectionSpy).toHaveBeenCalled()

    closeConnectionSpy.mockRestore()
  })

  test('stop function when receiver is undefined', async () => {
    await stop()
    // No error should be thrown when receiver is undefined
  })

  // adding a test in here to cover the messaging keep-alive function
  describe('keepAlive function', () => {
    jest.useFakeTimers()

    test('should call setInterval with a no-op function and a delay of 60000 ms', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval')

      keepAlive()

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000)
    })
  })
})
