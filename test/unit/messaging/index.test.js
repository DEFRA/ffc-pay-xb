const { start: startMessaging, stop: stopMessaging } = require('../../../app/messaging')
const { MessageReceiver } = require('ffc-messaging')
const { processXbMessage } = require('../../../app/messaging/process-xb-message.js')
const { keepAlive } = require('../../../app/messaging/keep-alive')
const { messageConfig } = require('../../../app/config')

jest.mock('ffc-messaging')
jest.mock('../../../app/messaging/process-xb-message.js')
jest.mock('../../../app/messaging/keep-alive')
jest.mock('../../../app/config')

describe('start and stop functions', () => {
  let consoleLogSpy

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
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

    await startMessaging()

    expect(MessageReceiver).toHaveBeenCalled()
    expect(processXbMessage).toHaveBeenCalledWith('mock message', expect.anything())
    expect(console.log).toHaveBeenCalledWith('Ready to process Cross Border payment requests')
  })

  test('start function when messageConfig is not active', async () => {
    messageConfig.active = false
    await startMessaging()
    expect(keepAlive).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('Cross Border adapter is not active')
  })

  test('stop function', async () => {
    messageConfig.active = true

    await startMessaging()

    const receiver = receiverInstances[receiverInstances.length - 1]
    const closeConnectionSpy = jest.spyOn(receiver, 'closeConnection')

    await stopMessaging()

    expect(closeConnectionSpy).toHaveBeenCalled()

    closeConnectionSpy.mockRestore()
  })
})
