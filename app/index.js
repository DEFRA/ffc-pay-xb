require('./insights').setup()
require('log-timestamp')
const { start: startMessaging, stop: stopMessaging } = require('./messaging')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await stopMessaging()
  process.exit(0)
})

module.exports = (async () => {
  await startMessaging()
})()
