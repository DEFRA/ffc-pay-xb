const fs = require('fs')
const path = require('path')
const sql = require('mssql')

const { databaseConfig } = require('../../../app/config')

const json = fs.readFileSync(path.resolve(__dirname, '../../mocks/json.json'), 'utf8')

const receiver = {
  completeMessage: jest.fn(),
  abandonMessage: jest.fn(),
  deadLetterMessage: jest.fn()
}

const message = {
  body: JSON.parse(json)
}

const { processXbMessage } = require('../../../app/messaging/process-xb-message')

describe('process cross border message', () => {
  beforeEach(async () => {
    await sql.connect(databaseConfig)
    await sql.query`DELETE FROM messages`
  })

  test('should save one cross border record to database per message', async () => {
    await processXbMessage(message, receiver)
    const result = await sql.query`SELECT * FROM messages`
    expect(result.recordset.length).toBe(1)
  })

  test('should save payment request id as invoice_id', async () => {
    await processXbMessage(message, receiver)
    const result = await sql.query`SELECT * FROM messages`
    expect(result.recordset[0].invoice_id).toBe(900000002)
  })

  test('should save payment request as message_in', async () => {
    await processXbMessage(message, receiver)
    const result = await sql.query`SELECT * FROM messages`
    expect(result.recordset[0].message_in).toMatch('<Root xmlns:ns0="http://RPA.Integration.CalcNPay.Schemas.CalcNPayDebachedSchema/v1.1" ID="900000002">')
  })

  test('should save current date as received', async () => {
    await processXbMessage(message, receiver)
    const result = await sql.query`SELECT * FROM messages`
    expect(result.recordset[0].received).toBeDefined()
  })
})
