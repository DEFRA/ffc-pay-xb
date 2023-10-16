jest.useFakeTimers()
jest.setSystemTime(new Date(2023, 0, 1))

const fs = require('fs')
const path = require('path')

const { convertPaymentRequestToXml } = require('../../../../app/conversion/convert-payment-request-to-xml')

const xml = fs.readFileSync(path.resolve(__dirname, '../../../mocks/xml.xml'), 'utf8')
const json = fs.readFileSync(path.resolve(__dirname, '../../../mocks/json.json'), 'utf8')

describe('convert payment request to xml', () => {
  test('should convert payment request to xml', () => {
    const result = convertPaymentRequestToXml(JSON.parse(json))
    expect(result).toBe(xml.trim())
  })
})
