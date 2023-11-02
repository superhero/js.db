class NestedTransactionsNotAllowed extends Error
{
  constructor(...args)
  {
    super(...args)
    this.code = 'E_MYSQL2_NESTED_TRANSACTIONS_UNSUPPORTED'
  }
}

module.exports = NestedTransactionsNotAllowed
