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
  const receiverInstances = []

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    keepAliveSpy = jest.spyOn(require('../../../app/messaging/keep-alive'), 'keepAlive')
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    keepAliveSpy.mockRestore()
  })

  const mockReceiver = (action = null) => {
    const instance = {
      subscribe: jest.fn(() => action && action('mock message')),
      closeConnection: jest.fn()
    }
    receiverInstances.push(instance)
    return instance
  }

  test('start: processes message when active', async () => {
    messageConfig.active = true

    MessageReceiver.mockImplementation((_, action) => mockReceiver(action))

    await start()

    expect(MessageReceiver).toHaveBeenCalled()
    expect(processXbMessage).toHaveBeenCalledWith('mock message', expect.anything())
    expect(console.log).toHaveBeenCalledWith('Ready to process Cross Border payment requests')
  })

  test('start: logs inactive state', async () => {
    messageConfig.active = false

    await start()

    expect(keepAliveSpy).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('Cross Border adapter is not active')
  })

  test('stop: closes receiver connection', async () => {
    messageConfig.active = true

    MessageReceiver.mockImplementation(() => mockReceiver())

    await start()
    const receiver = receiverInstances.at(-1)
    const closeSpy = jest.spyOn(receiver, 'closeConnection')

    await stop()

    expect(closeSpy).toHaveBeenCalled()
    closeSpy.mockRestore()
  })

  describe('keepAlive', () => {
    jest.useFakeTimers()

    test('calls setInterval with noop every 60s', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval')

      keepAlive()

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000)
    })
  })
})
