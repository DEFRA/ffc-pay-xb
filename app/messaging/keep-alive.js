const keepAliveConfig = require('../config/keep-alive')

const keepAlive = () => {
  setInterval(() => {}, keepAliveConfig.interval)
}

module.exports = {
  keepAlive
}
