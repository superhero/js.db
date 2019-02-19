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


  query(...args)
  {
    return this._query(...args)
  }

  //We are forced to have a different query function to be able to use it from inside
  //the class without the Proxy making interferences
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
