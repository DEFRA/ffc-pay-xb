const sql = require('mssql')

const completeCrossBorderPaymentEngine = async (id, transaction) => {
  const request = new sql.Request(transaction)
  request.input('id', sql.Int, id)
  request.input('sent', sql.DateTime, new Date())
  await request.query('UPDATE [dbo].[messages] SET sent = @sent WHERE id = @id')
}

module.exports = {
  completeCrossBorderPaymentEngine
}
