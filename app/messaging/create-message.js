const { XB } = require('../constants/messages')
const { SOURCE } = require('../constants/source')

const createMessage = (body) => {
  return {
    body,
    type: XB,
    source: SOURCE
  }
}

module.exports = {
  createMessage
}
