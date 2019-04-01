class TransactionsNotAllowed extends Error
{
  constructor(...args)
  {
    super(...args)
    this.code = 'E_REDIS_TRANSACTIONS_UNSUPPORTED'
  }
}

module.exports = TransactionsNotAllowed
