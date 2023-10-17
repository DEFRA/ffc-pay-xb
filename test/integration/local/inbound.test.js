jest.useFakeTimers()
jest.setSystemTime(new Date(2023, 0, 1))

const fs = require('fs')
const path = require('path')
const sql = require('mssql')

const { databaseConfig } = require('../../../app/config')

// const xml = fs.readFileSync(path.resolve(__dirname, '../../mocks/xml.xml'), 'utf8')
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
  beforeAll(async () => {
    console.log(databaseConfig)
    await sql.connect(databaseConfig)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    await sql.query`TRUNCATE TABLE messages RESTART IDENTITY;`
  })

  afterAll(() => {
    sql.close()
  })

  test('should save one cross border record to database per message', async () => {
    await processXbMessage(message, receiver)
    const result = await sql.query`SELECT * FROM messages`
    expect(result.recordset.length).toBe(1)
  })

  test('should save payment request id as invoice_id', async () => {
    await processXbMessage(message, receiver)
    const result = await sql.query`SELECT * FROM messages`
    expect(result.recordset[0].invoice_id).toBe('PR-1234')
  })
})
