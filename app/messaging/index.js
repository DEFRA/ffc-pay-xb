const { messageConfig } = require('../config')
const { keepAlive } = require('./keep-alive')
const { MessageReceiver } = require('ffc-messaging')
const { processXbMessage } = require('./process-xb-message.js')
let receiver

const start = async () => {
  if (messageConfig.active) {
    const xbAction = message => processXbMessage(message, receiver)
    receiver = new MessageReceiver(messageConfig.xbSubscription, xbAction)
    await receiver.subscribe()

    console.log('Ready to process Cross Border payment requests')
  } else {
    console.log('Cross Border adapter is not active')
    keepAlive()
  }
}

const stop = async () => {
  await receiver.closeConnection()
}

module.exports = { start, stop }
