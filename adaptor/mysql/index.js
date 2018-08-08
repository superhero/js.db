const Transaction = require('./transaction')

module.exports = class MySqlAdaptor
{
  static from(mysql, connectionLimit, host, user, password)
  {
    const pool = mysql.createPool({connectionLimit, host, user, password})
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
    const
    connection  = await this.getConnection(),
    transaction = new Transaction(connection)

    await transaction.query('START TRANSACTION')

    return transaction
  }
}
