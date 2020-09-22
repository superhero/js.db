const AdapterPostgresTransaction = require('./transaction')

class AdapterPostgres
{
  constructor(pool)
  {
    this.pool = pool
  }

  query(...args)
  {
    return this.pool.query(...args)
  }

  getConnection()
  {
    return this.pool.connect()
  }

  async createTransaction()
  {
    const connection  = await this.getConnection()
    await connection.query('BEGIN')
    const transaction = new AdapterPostgresTransaction(connection)

    return transaction
  }

  close()
  {
    this.pool.end()
  }
}

module.exports = AdapterPostgres
