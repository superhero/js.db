module.exports = class
{
  constructor(connection)
  {
    this.connection = connection
  }

  createTransaction()
  {
    const err = new Error('Nested transactions are not allowed')
    err.code = 'ERR_NESTED_TRANSACTION_UNSUPPORTED'
    throw err
  }

  async query(query, ...ctx)
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
