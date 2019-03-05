class NestedTransactionsNotAllowed extends Error
{
  constructor(...args)
  {
    super(...args)
    this.code = 'E_NESTED_TRANSACTION_UNSUPPORTED'
  }
}

module.exports = NestedTransactionsNotAllowed
