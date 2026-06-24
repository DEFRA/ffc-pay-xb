const Joi = require('joi')

const schema = Joi.object({
  active: Joi.bool().default(true),
  responseInterval: Joi.number().default(60000)
})
const config = {
  active: process.env.ACTIVE,
  responseInterval: process.env.RESPONSE_INTERVAL
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The response processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
