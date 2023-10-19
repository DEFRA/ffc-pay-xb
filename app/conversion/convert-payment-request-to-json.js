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
    invoiceLines: json.Root.Requests[0].Request[0].InvoiceLines.map(x => ({
      schemeCode: x.InvoiceLine[0].$.SchemeCode,
      fundCode: x.InvoiceLine[0].$.Fund,
      agreementNumber: json.Root.Requests[0].Request[0].Invoice[0].$.ClaimNumber,
      description: x.InvoiceLine[0].$.LineTypeDescription,
      value: convertToPence(x.InvoiceLine[0].$.Value),
      convergence: false,
      deliveryBody: x.InvoiceLine[0].$.DeliveryBody,
      marketingYear: x.InvoiceLine[0].$.MarketingYear,
      stateAid: false
    }))
  }
}

module.exports = {
  convertPaymentRequestToJson
}
