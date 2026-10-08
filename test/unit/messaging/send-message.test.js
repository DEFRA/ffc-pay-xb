jest.mock('../../../app/messaging/service-bus')
jest.mock('../../../app/config', () => ({
  messageConfig: {}
}))
jest.mock('../../../app/messaging/create-message')

const { sendMessage } = require('../../../app/messaging/send-message')
const { getSender, sendMessage: sendServiceBusMessage } = require('../../../app/messaging/service-bus')
const { messageConfig } = require('../../../app/config')
const { createMessage } = require('../../../app/messaging/create-message')

describe('messaging sendMessage', () => {
  let sender
  let message

  beforeEach(() => {
    jest.clearAllMocks()
    sender = { sendMessages: jest.fn() }
    message = { body: { invoiceNumber: 'S0000001V001' } }

    getSender.mockReturnValue(sender)
    createMessage.mockReturnValue(message)
  })

  test('gets sender for response topic', async () => {
    messageConfig.responseTopic = { address: 'response-topic' }

    await sendMessage({ invoiceNumber: 'S0000001V001' })

    expect(getSender).toHaveBeenCalledWith(messageConfig.responseTopic)
  })

  test('creates message from payment request', async () => {
    const paymentRequest = { invoiceNumber: 'S0000001V001' }

    await sendMessage(paymentRequest)

    expect(createMessage).toHaveBeenCalledWith(paymentRequest)
  })

  test('sends message via service bus sender', async () => {
    await sendMessage({ invoiceNumber: 'S0000001V001' })

    expect(sendServiceBusMessage).toHaveBeenCalledWith(sender, message)
  })
})
