const convertInvoiceNumberForJson = (invoiceHeader) => {
  return `S${invoiceHeader.InvoiceNumber.slice(-7)}${invoiceHeader.ClaimNumber}V${Number(invoiceHeader.RequestInvoiceNumber).toString().padStart(3, '0')}`
}

module.exports = {
  convertInvoiceNumberForJson
}
