const NestedTransactionsNotAllowed = require('./error/nested-transactions-not-allowed')

class AdapterMySql2Transaction
{
  constructor(connection)
  {
    this.connection = connection
  }

  createTransaction()
  {
    throw new NestedTransactionsNotAllowed('Nested transactions are not allowed')
  }

  query(query, ...ctx)
  {
    return new Promise((accept, reject) =>
      this.connection.query(query, ...ctx, (error, response) =>
        error
        ? reject(error)
        : accept(response)))
  }

  async commit()
  {
    await this.query('COMMIT')
    this.connection.release()
  }

  async rollback()
  {
    await this.query('ROLLBACK')
    this.connection.release()
  }
}

module.exports = AdapterMySql2Transaction
