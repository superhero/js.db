const promisify = require('util').promisify

module.exports = class
{
  constructor(gateway, connection)
  {
    this.gateway    = gateway
    this.connection = connection
    this._query     = promisify(connection.query.bind(connection))
  }

  createTransaction()
  {
    const err = new Error('Nested transactions are not allowed')
    err.code = 'ERR_NESTED_TRANSACTION_UNSUPPORTED'
    throw err
  }

  async query(file, ...ctx)
  {
    const
    template = await this.gateway.getTemplate(file),
    response = await this._query(template, ...ctx)

    return response
  }

  async commit(...args)
  {
    await query('COMMIT', ...args)
    this.connection.release()
  }

  async rollback(...args)
  {
    await query('ROLLBACK')
    this.connection.release()
  }
}
