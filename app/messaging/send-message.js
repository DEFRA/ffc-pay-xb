const { MessageSender } = require('ffc-messaging')
const { messageConfig } = require('../config')
const { createMessage } = require('./create-message')

const sendMessage = async (paymentRequest) => {
  const sender = new MessageSender(messageConfig.responseTopic)
  const message = createMessage(paymentRequest)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendMessage
}
