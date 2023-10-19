require('./insights').setup()
require('log-timestamp')
const { start: startMessaging, stop: stopMessaging } = require('./messaging')
const { start: startResponses } = require('./responses')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await stopMessaging()
  process.exit(0)
})

module.exports = (async () => {
  await startMessaging()
  await startResponses()
})()
