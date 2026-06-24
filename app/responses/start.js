const { responseConfig } = require('../config')
const { processResponses } = require('./process-responses')

const start = async () => {
  if (responseConfig.active) {
    try {
      await processResponses()
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(start, responseConfig.responseInterval)
    }
  }
}

module.exports = {
  start
}
