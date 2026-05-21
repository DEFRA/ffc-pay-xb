const { convertPaymentRequestToXml } = require('../conversion')
const { saveToCrossBorderPaymentEngine } = require('./save-to-cross-border-payment-engine')

const processXbMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Cross Border payment request received:', { frn: paymentRequest.frn, invoiceNumber: paymentRequest.invoiceNumber })
    const { id, convertedPaymentRequest } = convertPaymentRequestToXml(paymentRequest)
    await saveToCrossBorderPaymentEngine(id, convertedPaymentRequest)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process payment request:', err)
  }
}

module.exports = {
  processXbMessage
}
