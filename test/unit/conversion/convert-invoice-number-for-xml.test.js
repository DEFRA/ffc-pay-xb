const { convertInvoiceNumberForXml } = require('../../../app/conversion/convert-invoice-number-for-xml')

describe('convert invoice number for xml', () => {
  test('should convert Payment Hub format to Payment Filter format', () => {
    const invoiceNumber = 'S1234567C1234567V001'
    const result = convertInvoiceNumberForXml(invoiceNumber)
    expect(result).toBe('PFSY1234567')
  })
})
