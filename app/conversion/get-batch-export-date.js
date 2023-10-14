const moment = require('moment')

const getBatchExportDate = (batch) => {
  const dateString = batch.split('_')[3].split('.')[0]
  return moment(dateString, 'YYYYMMDDHHmmssSSS').format('YYYY-MM-DD')
}

module.exports = {
  getBatchExportDate
}
