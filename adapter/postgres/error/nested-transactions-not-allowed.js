class NestedTransactionsNotAllowed extends Error
{
  constructor(...args)
  {
    super(...args)
    this.code = 'E_POSTGRES_NESTED_TRANSACTIONS_UNSUPPORTED'
  }
}

module.exports = NestedTransactionsNotAllowed
