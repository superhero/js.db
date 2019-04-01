class NestedTransactionsNotAllowed extends Error
{
  constructor(...args)
  {
    super(...args)
    this.code = 'E_MYSQL_NESTED_TRANSACTIONS_UNSUPPORTED'
  }
}

module.exports = NestedTransactionsNotAllowed
