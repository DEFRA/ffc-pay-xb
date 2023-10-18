const { convertInvoiceNumberForJson } = require('../../../app/conversion/convert-invoice-number-for-json')

describe('convert invoice number for json', () => {
  test('should convert Payment Filter format to Payment Hub format', () => {
    const invoiceHeader = {
      InvoiceNumber: 'PFSY1234567',
      ClaimNumber: 'C1234567',
      RequestInvoiceNumber: '001'
    }
    const result = convertInvoiceNumberForJson(invoiceHeader)
    expect(result).toBe('S1234567C1234567V001')
  })
})
