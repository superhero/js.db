class TransactionsNotAllowed extends Error
{
  constructor(...args)
  {
    super(...args)
    this.code = 'E_INFLUXDB_TRANSACTIONS_UNSUPPORTED'
  }
}

module.exports = TransactionsNotAllowed
