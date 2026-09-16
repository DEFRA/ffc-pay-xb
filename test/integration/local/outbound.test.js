const fs = require('fs')
const path = require('path')
const sql = require('mssql')

const { databaseConfig } = require('../../../app/config')

const json = fs.readFileSync(path.resolve(__dirname, '../../mocks/json.json'), 'utf8')

jest.mock('../../../app/messaging/send-message')
const { sendMessage: mockSendMessage } = require('../../../app/messaging/send-message')

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
    mockSendMessage.mockClear()
  })

  test('should send message to response topic', async () => {
    await processResponses()
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('should send message in json format', async () => {
    await processResponses()
    expect(mockSendMessage.mock.calls[0][0].invoiceNumber).toBe('S0000002C0000002V001')
  })
})
