const Joi = require('joi')

const schema = Joi.object({
  active: Joi.bool().default(true),
  messageQueue: {
    host: Joi.string().required(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object(),
    managedIdentityClientId: Joi.string().optional()
  },
  xbSubscription: {
    address: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().default('subscription')
  },
  responseTopic: {
    address: Joi.string().required()
  }
})
const config = {
  active: process.env.ACTIVE,
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined,
    managedIdentityClientId: process.env.AZURE_CLIENT_ID
  },
  xbSubscription: {
    address: process.env.XB_SUBSCRIPTION_ADDRESS,
    topic: process.env.XB_TOPIC_ADDRESS
  },
  responseTopic: {
    address: process.env.XBRESPONSE_TOPIC_ADDRESS
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The message queue config is invalid. ${result.error.message}`)
}

const xbSubscription = { ...result.value.messageQueue, ...result.value.xbSubscription }
const responseTopic = { ...result.value.messageQueue, ...result.value.responseTopic }

module.exports = {
  active: result.value.active,
  xbSubscription,
  responseTopic
}
