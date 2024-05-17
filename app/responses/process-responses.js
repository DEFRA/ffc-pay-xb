const util = require('util')
const sql = require('mssql')
const { databaseConfig } = require('../config')
const { getPendingPaymentRequests } = require('./get-pending-payment-requests')
const { convertPaymentRequestToJson } = require('../conversion')
const { sendMessage } = require('../messaging/send-message')
const { completeCrossBorderPaymentEngine } = require('./complete-cross-border-payment-engine')

const processResponses = async () => {
  await sql.connect(databaseConfig)
  const transaction = new sql.Transaction()
  await transaction.begin()
  try {
    const pendingPaymentRequests = await getPendingPaymentRequests(transaction)
    for (const pendingPaymentRequest of pendingPaymentRequests) {
      try {
        const convertedPaymentRequest = await convertPaymentRequestToJson(pendingPaymentRequest.paymentRequest)
        console.log('Cross Border payment response received:', util.inspect(convertedPaymentRequest, false, null, true))
        await sendMessage(convertedPaymentRequest)
        await completeCrossBorderPaymentEngine(pendingPaymentRequest.id, transaction)
      } catch (err) {
        console.log('Unable to publish payment request to Json:', pendingPaymentRequest.paymentRequest, err)
      }
    }
    await transaction.commit()
  } catch (err) {
    transaction.rollback()
  }
}

module.exports = {
  processResponses
}
