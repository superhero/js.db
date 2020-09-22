const NestedTransactionsNotAllowed = require('./error/nested-transactions-not-allowed')

class AdapterPostgresTransaction
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
    return this.connection.query(...args)
  }

  async commit()
  {
    await this.connection.query('COMMIT')
    this.connection.release()
  }

  async rollback()
  {
    await this.connection.query('ROLLBACK')
    this.connection.release()
  }
}

module.exports = AdapterPostgresTransaction
