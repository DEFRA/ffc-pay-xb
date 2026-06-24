const Joi = require('joi')

const schema = Joi.object({
  interval: Joi.number().default(60000)
})

const config = {
  interval: process.env.KEEP_ALIVE_INTERVAL
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The keep alive config is invalid. ${result.error.message}`)
}

module.exports = result.value
