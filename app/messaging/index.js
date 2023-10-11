const { messageConfig } = require('../config')
const { MessageReceiver } = require('ffc-messaging')
const { processXbMessage } = require('./process-xb-message.js')
let receiver

const start = async () => {
  const xbAction = message => processXbMessage(message, receiver)
  receiver = new MessageReceiver(messageConfig.xbSubscription, xbAction)
  await receiver.subscribe()

  console.log('Ready to process Cross Border payment requests')
}

const stop = async () => {
  await receiver.closeConnection()
}

module.exports = { start, stop }
