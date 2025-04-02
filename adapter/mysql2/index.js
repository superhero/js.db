const AdapterMySql2Transaction = require('./transaction')

class AdapterMySql2
{
  constructor(pool)
  {
    this.pool = pool
  }

  query(query, ...ctx)
  {
    const resolve = (accept, reject, i = 0) =>
      this.pool.query(query, ctx, (error, response) =>
        error
        ? ['ETIMEDOUT', 'ECONNREFUSED', 'ECONNRESET'].includes(error.code) && i < 3
          ? resolve(accept, reject, ++i)
          : reject(error)
        : accept(response))

    return new Promise(resolve)
  }

  getConnection()
  {
    const resolve = (accept, reject, i = 0) =>
      this.pool.getConnection((error, connection) =>
        error
        ? error.code === 'ETIMEDOUT' && i < 3
          ? resolve(accept, reject, ++i)
          : reject(error)
        : accept(connection))

    return new Promise(resolve)
  }

  async createTransaction()
  {
    const connection  = await this.getConnection()
    await connection.query('START TRANSACTION')
    const transaction = new AdapterMySql2Transaction(connection)

    return transaction
  }

  close()
  {
    this.pool.end()
  }
}

module.exports = AdapterMySql2
