const convertInvoiceNumberForXml = (invoiceNumber) => {
  return `PFSY${invoiceNumber.slice(1, 8)}`
}

module.exports = {
  convertInvoiceNumberForXml
}
