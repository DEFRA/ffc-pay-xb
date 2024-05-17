const xml2js = require('xml2js')
const { convertToPence } = require('./currency-convert')
const { convertInvoiceNumberForJson } = require('./convert-invoice-number-for-json')

const convertPaymentRequestToJson = async (paymentRequest) => {
  const parser = new xml2js.Parser()
  const json = await parser.parseStringPromise(paymentRequest)
  return {
    schemeId: 6,
    sourceSystem: 'SITI AGRI SYS',
    deliveryBody: json.Root.Requests[0].Request[0].Invoice[0].$.DeliveryBody,
    invoiceNumber: convertInvoiceNumberForJson(json.Root.Requests[0].Request[0].Invoice[0].$),
    frn: json.Root.Requests[0].Request[0].Invoice[0].$.FRN,
    ledger: json.Root.Requests[0].Request[0].Invoice[0].$.InvoiceType,
    marketingYear: json.Root.Requests[0].$.MarketingYear,
    agreementNumber: json.Root.Requests[0].Request[0].Invoice[0].$.ClaimNumber,
    contractNumber: json.Root.Requests[0].Request[0].Invoice[0].$.ClaimNumber,
    paymentRequestNumber: Number(json.Root.Requests[0].Request[0].Invoice[0].$.RequestInvoiceNumber),
    currency: json.Root.Requests[0].Request[0].Invoice[0].$.PaymentPreferenceCurrency,
    value: convertToPence(json.Root.Requests[0].Request[0].Invoice[0].$.TotalAmount),
    invoiceLines: json.Root.Requests[0].Request[0].InvoiceLines[0].InvoiceLine.map(x => ({
      schemeCode: x.$.SchemeCode,
      fundCode: x.$.Fund,
      agreementNumber: json.Root.Requests[0].Request[0].Invoice[0].$.ClaimNumber,
      description: x.$.LineTypeDescription,
      value: convertToPence(x.$.Value),
      convergence: false,
      deliveryBody: x.$.DeliveryBody,
      marketingYear: x.$.MarketingYear,
      stateAid: false
    }))
  }
}

module.exports = {
  convertPaymentRequestToJson
}
