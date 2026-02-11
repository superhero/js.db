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

  getFormattedQuery(query, ...ctx)
  {
    return this.pool.format(query, ...ctx)
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

  async lock(
    reference, 
    operation,
    timeout     = 10, 
    connection  = null)
  {
    connection = connection ?? await this.getConnection()

    try
    {
      const
        result = await new Promise((resolve, reject) =>
          connection.query('SELECT GET_LOCK(?, ?) as status', [reference, timeout], (error, result) =>
            error ? reject(error) : resolve(result))),
        status = result[0].status

      if(1 === status)
      {
        return await operation(connection)
      }
      else if(0 === status)
      {
        const error     = new Error(`advisory lock '${reference}' is busy by a different process`)
        error.code      = 'DB_LOCK_TIMEOUT'
        error.reference = reference
        error.timeout   = timeout
        throw error
      }
      else
      {
        const error     = new Error(`something is wrong with the query for the advisory lock '${reference}'`)
        error.code      = 'E_EVENTFLOW_DB_ADVISORY_LOCK_NULL_RESULT'
        error.reference = reference
        error.timeout   = timeout
        throw error
      }
    }
    finally
    {
      await new Promise((resolve, reject) =>
        connection.query('DO RELEASE_LOCK(?)', [reference], (error) =>
          error ? reject(error) : resolve()))
        .then(() => connection.release())
        .catch(() => connection.end())
    }
  }

  async createTransaction(connection = null)
  {
    connection = connection ?? await this.getConnection()
    await new Promise((resolve, reject) =>
      connection.query('START TRANSACTION', (error) =>
        error ? reject(error) : resolve()))
    return new AdapterMySql2Transaction(connection)
  }

  close()
  {
    this.pool.end()
  }
}

module.exports = AdapterMySql2
