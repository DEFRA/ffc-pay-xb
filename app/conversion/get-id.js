const getId = (paymentRequestId) => {
  return `9${paymentRequestId.toString().padStart(8, '0')}`
}

module.exports = {
  getId
}
