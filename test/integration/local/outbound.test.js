const fs = require('fs')
const path = require('path')
const sql = require('mssql')

const { databaseConfig } = require('../../../app/config')

const json = fs.readFileSync(path.resolve(__dirname, '../../mocks/json.json'), 'utf8')

const mockSendMessage = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: jest.fn()
      }
    })
  }
})

const receiver = {
  completeMessage: jest.fn(),
  abandonMessage: jest.fn(),
  deadLetterMessage: jest.fn()
}

const message = {
  body: JSON.parse(json)
}

const { processXbMessage } = require('../../../app/messaging/process-xb-message')
const { processResponses } = require('../../../app/responses/process-responses')

describe('process cross border updates', () => {
  beforeEach(async () => {
    await sql.connect(databaseConfig)
    await sql.query`DELETE FROM messages`
    await processXbMessage(message, receiver)
    await sql.query`UPDATE dbo.messages SET message_out = message_in`
  })

  test('should send message to cross border queue', async () => {
    await processResponses()
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('should send message in json format', async () => {
    await processResponses()
    expect(mockSendMessage.mock.calls[0][0].body.invoiceNumber).toBe('S0000002C0000002V001')
  })

  test('should close message connection when sent', async () => {
    await processResponses()
    expect(mockSendMessage.mock.instances[0].closeConnection).toHaveBeenCalled()
  })
})
