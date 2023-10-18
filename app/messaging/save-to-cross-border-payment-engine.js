const sql = require('mssql')
const { databaseConfig } = require('../config')

const saveToCrossBorderPaymentEngine = async (id, paymentRequest) => {
  await sql.connect(databaseConfig)

  const request = new sql.Request()
  await request.input('invoice_id', sql.Int, id)
  await request.input('received', sql.DateTime, new Date())
  await request.input('message_in', sql.Xml, paymentRequest)
  await request.query('INSERT INTO [dbo].[messages] ([invoice_id], [received], [message_in]) VALUES (@invoice_id, @received, @message_in)')

  console.log('Saved payment request in Cross Border Payment Engine', paymentRequest)
}

module.exports = {
  saveToCrossBorderPaymentEngine
}
