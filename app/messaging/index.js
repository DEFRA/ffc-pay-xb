const { messageConfig } = require('../config')
const { keepAlive } = require('./keep-alive')
const { createServiceBusClient, createReceiver, subscribeReceiver, closeSenders } = require('./service-bus')
const { processXbMessage } = require('./process-xb-message.js')

let sbClient
let receiver

const start = async () => {
  if (messageConfig.active) {
    sbClient = createServiceBusClient(messageConfig.xbSubscription)
    receiver = createReceiver(sbClient, messageConfig.xbSubscription)
    const errorHandler = (err) => console.error('Error receiving message:', err)

    subscribeReceiver(receiver, processXbMessage, errorHandler)
    console.log('Ready to process Cross Border payment requests')
  } else {
    console.log('Cross Border adapter is not active')
    keepAlive()
  }
}

const stop = async () => {
  if (sbClient) {
    try {
      await sbClient.close()
    } catch (err) {
      console.error('Error closing Service Bus client:', err)
    }
    sbClient = null
  }
  await closeSenders()
  receiver = null
}

module.exports = { start, stop }
