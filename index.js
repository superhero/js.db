const
  util        = require('util'),
  fs          = require('fs'),
  promisify   = util.promisify,
  readFile    = promisify(fs.readFile)

class Db
{
  constructor(adaptor, queryPath, fileSuffix = '')
  {
    this.adaptor    = adaptor
    this.queryPath  = require('path').normalize(queryPath) + '/'
    this.fileSuffix = fileSuffix
    this.queries    = {}
  }

  async close()
  {
    await this.adaptor.close()
  }

  async query(file, ...ctx)
  {
    let query = await this.getQuery(file)

    for(let noEscapeReplace = query.indexOf('?%s');
            noEscapeReplace > -1;
            noEscapeReplace = query.indexOf('?%s'))
    {
      query = query.replace('?%s', ctx.shift())
    }

    return await this.adaptor.query(query, ...ctx)
  }

  async formatQuery(file, formatCtx, sqlCtx)
  {
    const
      query           = await this.getQuery(file),
      formattedQuery  = util.format(query, ...formatCtx),
      response        = await this.adaptor.query(formattedQuery, ...sqlCtx)

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
    : this.queries[file] = await readFile(this.queryPath + file + this.fileSuffix)
    return query.toString()
  }
}

module.exports = Db
