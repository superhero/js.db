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

  query(...args)
  {
    return this._query(...args)
  }

  // We are forced to have a different query function to be able to use it from inside
  // the class without the Proxy making interferences
  async _query(query, ...ctx)
  {
    return new Promise((accept, reject) =>
      this.connection.query(query, ...ctx, (error, response) =>
        error
        ? reject(error)
        : accept(response)))
  }

  async commit()
  {
    await this._query('COMMIT')
    this.connection.release()
  }

  async rollback()
  {
    await this._query('ROLLBACK')
    this.connection.release()
  }
}

module.exports = AdapterMySql2Transaction
