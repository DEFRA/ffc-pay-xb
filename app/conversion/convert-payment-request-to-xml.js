const xml2js = require('xml2js')

const convertPaymentRequestToXml = (paymentRequest) => {
  const formattedPaymentRequest = {
    Root: {
      $: {
        'xmlns:ns0': 'http://RPA.Integration.CalcNPay.Schemas.CalcNPayDebachedSchema/v1.1',
        ID: 0
      },
      Header: {},
      Batch: {},
      Requests: {
        Request: {
          Invoice: {},
          InvoiceLines: {}
        }
      }
    }
  }

  const builder = new xml2js.Builder()
  return builder.buildObject(formattedPaymentRequest)
}

module.exports = {
  convertPaymentRequestToXml
}
