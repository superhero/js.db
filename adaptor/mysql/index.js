const Transaction = require('./transaction')

module.exports = class MySqlAdaptor
{
  static from(mysql, config)
  {
    const pool = mysql.createPool(config)
    return new MySqlAdaptor(pool)
  }

  constructor(pool)
  {
    this.pool = pool
  }

  query(query, ...ctx)
  {
    return new Promise((accept, reject) =>
      this.pool.query(query, ...ctx, (error, response) =>
        error
        ? reject(error)
        : accept(response)))
  }

  getConnection()
  {
    return new Promise((accept, reject) =>
      this.pool.getConnection((error, connection) =>
        error
        ? reject(error)
        : accept(connection)))
  }

  async createTransaction()
  {
    const connection  = await this.getConnection()
    await connection.query('START TRANSACTION')
    const transaction = new Transaction(connection)

    return transaction
  }
}
