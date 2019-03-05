const TransactionsNotAllowed = require('./error/transactions-not-allowed')

class AdaptorRedis
{
  constructor(client)
  {
    this.client = client
  }

  query(query, ...ctx)
  {
    return new Promise((accept, reject) =>
      this.client.send_command(query, ctx, (error, response) =>
        error
        ? reject(error)
        : accept(response)))
  }

  async createTransaction()
  {
    throw new TransactionsNotAllowed('Redis transactions are not available')
  }
}

module.exports = AdaptorRedis
