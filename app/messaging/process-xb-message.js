const util = require('util')

const processXbMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log('Cross Border payment request received:', util.inspect(paymentRequest, false, null, true))
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process payment request:', err)
  }
}

module.exports = {
  processXbMessage
}
