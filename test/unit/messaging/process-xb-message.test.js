jest.mock('../../../app/conversion')
const { convertPaymentRequestToXml: mockConvertPaymentRequestToXml } = require('../../../app/conversion')

jest.mock('../../../app/messaging/save-to-cross-border-payment-engine')
const { saveToCrossBorderPaymentEngine: mockSaveToCrossBorderPaymentEngine } = require('../../../app/messaging/save-to-cross-border-payment-engine')

const receiver = {
  completeMessage: jest.fn(),
  abandonMessage: jest.fn(),
  deadLetterMessage: jest.fn()
}

const message = {
  body: {
    frn: '1234567890'
  }
}

const convertedPaymentRequest = '<root>converted payment</root>'

const { processXbMessage } = require('../../../app/messaging/process-xb-message')

describe('process cross border message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConvertPaymentRequestToXml.mockReturnValue(convertedPaymentRequest)
  })

  test('should convert payment to xml', async () => {
    await processXbMessage(message, receiver)
    expect(mockConvertPaymentRequestToXml).toHaveBeenCalledWith(message.body)
  })

  test('should save converted payment to cross border payment engine', async () => {
    await processXbMessage(message, receiver)
    expect(mockSaveToCrossBorderPaymentEngine).toHaveBeenCalledWith(convertedPaymentRequest)
  })

  test('should complete message if successfully processed', async () => {
    await processXbMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should not complete message if unable to convert payment', async () => {
    mockConvertPaymentRequestToXml.mockImplementation(() => {
      throw new Error('Unable to convert payment')
    })
    await processXbMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })
})
