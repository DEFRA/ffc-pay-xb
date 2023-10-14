const getBatchId = (batch) => {
  const batchId = Number(batch.split('_')[1])
  return isNaN(batchId) ? 1 : batchId
}

module.exports = {
  getBatchId
}
