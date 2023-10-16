const moment = require('moment')

const getBatchExportDate = (batch) => {
  const dateString = batch.split('_')[3]?.split('.')[0]
  const date = moment(dateString, 'YYYYMMDDHHmmssSSS')
  return date.isValid() ? date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
}

module.exports = {
  getBatchExportDate
}
