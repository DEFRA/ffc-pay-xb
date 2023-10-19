const sql = require('mssql')

const getPendingPaymentRequests = async (transaction) => {
  const request = new sql.Request(transaction)
  const result = await request.query('SELECT [id], [message_out] FROM [dbo].[messages] WHERE [message_out] IS NOT NULL AND [sent] IS NULL;')
  return result.recordset.map(x => ({
    id: x.id,
    paymentRequest: x.message_out
  }))
}

module.exports = {
  getPendingPaymentRequests
}
