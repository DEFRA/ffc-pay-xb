const { getSender, sendMessage: sendServiceBusMessage } = require('./service-bus')
const { messageConfig } = require('../config')
const { createMessage } = require('./create-message')

const sendMessage = async (paymentRequest) => {
  const sender = getSender(messageConfig.responseTopic)
  const message = createMessage(paymentRequest)
  await sendServiceBusMessage(sender, message)
}

module.exports = {
  sendMessage
}
