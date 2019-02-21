const
util        = require('util'),
fs          = require('fs'),
promisify   = util.promisify,
readFile    = promisify(fs.readFile)

module.exports = class
{
  constructor(adaptor, sqlPath)
  {
    this.adaptor = adaptor
    this.sqlPath = require('path').normalize(sqlPath) + '/'
    this.queries = {}
  }

  async query(file, ...ctx)
  {
    const
    query     = await this.getQuery(file),
    response  = await this.adaptor.query(query, ...ctx)

    return response
  }

  async createTransaction()
  {
    const transaction = await this.adaptor.createTransaction()

    return new Proxy(transaction,
    {
      get: (target, property) =>
      {
        return property !== 'query'
        ? target[property]
        : async (file, ...ctx) =>
        {
          const
          query     = await this.getQuery(file),
          response  = await transaction.query(query, ...ctx)

          return response
        }
      }
    })
  }

  async getQuery(file)
  {
    const query = file in this.queries
    ? this.queries[file]
    : this.queries[file] = await readFile(this.sqlPath + file + '.sql')
    return query.toString()
  }
}
