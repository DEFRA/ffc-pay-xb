const { MessageSender } = require('ffc-messaging')
const { createMessage } = require('./create-message')

const sendMessage = async (paymentRequest, config) => {
  const sender = new MessageSender(config)
  const message = createMessage(paymentRequest)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendMessage
}
