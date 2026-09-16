jest.mock('../../../app/messaging/service-bus')
jest.mock('../../../app/messaging/process-xb-message.js')
jest.mock('../../../app/messaging/keep-alive')
jest.mock('../../../app/config', () => ({
  messageConfig: {}
}))

const { start, stop } = require('../../../app/messaging')
const { processXbMessage } = require('../../../app/messaging/process-xb-message.js')
const { keepAlive } = require('../../../app/messaging/keep-alive')
const { createServiceBusClient, createReceiver, subscribeReceiver, closeSenders } = require('../../../app/messaging/service-bus')
const { messageConfig } = require('../../../app/config')

describe('start and stop functions', () => {
  let consoleLogSpy
  let consoleErrorSpy
  let mockSbClient
  let mockReceiver

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    jest.clearAllMocks()

    mockSbClient = { close: jest.fn().mockResolvedValue() }
    mockReceiver = { subscribe: jest.fn() }

    createServiceBusClient.mockReturnValue(mockSbClient)
    createReceiver.mockReturnValue(mockReceiver)
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  test('start: creates service bus client and receiver when active', async () => {
    messageConfig.active = true
    messageConfig.xbSubscription = { host: 'test', address: 'sub', topic: 'topic' }

    await start()

    expect(createServiceBusClient).toHaveBeenCalledWith(messageConfig.xbSubscription)
    expect(createReceiver).toHaveBeenCalledWith(mockSbClient, messageConfig.xbSubscription)
  })

  test('start: subscribes receiver to process messages when active', async () => {
    messageConfig.active = true

    await start()

    expect(subscribeReceiver).toHaveBeenCalledWith(mockReceiver, processXbMessage, expect.any(Function))
  })

  test('start: logs ready when active', async () => {
    messageConfig.active = true

    await start()

    expect(console.log).toHaveBeenCalledWith('Ready to process Cross Border payment requests')
  })

  test('start: error handler logs errors', async () => {
    messageConfig.active = true
    const testError = new Error('test error')

    await start()
    const errorHandler = subscribeReceiver.mock.calls[0][2]
    errorHandler(testError)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error receiving message:', testError)
  })

  test('start: logs inactive state', async () => {
    messageConfig.active = false

    await start()

    expect(keepAlive).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('Cross Border adapter is not active')
  })

  test('stop: closes service bus client', async () => {
    messageConfig.active = true
    await start()

    await stop()

    expect(mockSbClient.close).toHaveBeenCalledTimes(1)
  })

  test('stop: closes senders', async () => {
    messageConfig.active = true
    await start()

    await stop()

    expect(closeSenders).toHaveBeenCalledTimes(1)
  })

  test('stop: logs error if client close fails', async () => {
    messageConfig.active = true
    await start()
    const closeError = new Error('close failed')
    mockSbClient.close.mockRejectedValue(closeError)

    await stop()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error closing Service Bus client:', closeError)
  })

  describe('keepAlive', () => {
    jest.useFakeTimers()

    test('calls setInterval with noop every 60s', () => {
      const { keepAlive: actualKeepAlive } = jest.requireActual('../../../app/messaging/keep-alive')
      const setIntervalSpy = jest.spyOn(global, 'setInterval')

      actualKeepAlive()

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000)
    })
  })
})
