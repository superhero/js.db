const
  util        = require('util'),
  fs          = require('fs'),
  path        = require('path'),
  promisify   = util.promisify,
  readFile    = promisify(fs.readFile)

class Db
{
  constructor(adaptor, queryPath, fileSuffix = '')
  {
    this.adaptor    = adaptor
    this.queryPath  = path.normalize(queryPath) + path.sep
    this.fileSuffix = fileSuffix
    this.queries    = {}
  }

  async close()
  {
    await this.adaptor.close()
  }

  async query(file, ...ctx)
  {
    let query = await this.getQuery(file, ctx)
  
    try
    {
      return await this.adaptor.query(query, ...ctx)
    }
    catch(reason)
    {
      this._throwOnQueryError(reason, file, query, ctx)
    }
  }

  async lock(...args)
  {
    if('lock' in this.adaptor)
    {
      return await this.adaptor.lock(...args)
    }
    else
    {
      throw new Error('The database adapter provided does not support locking')
    }
  }

  async createTransaction(connection)
  {
    const transaction = await this.adaptor.createTransaction(connection)

    return new Proxy(transaction,
    {
      get: (target, member) =>
      {
        return 'query' !== member
        ? Reflect.get(target, member, target)
        : async (file, ...ctx) =>
        {
          const query = await this.getQuery(file, ctx)

          try
          {
            const method = Reflect.get(target, member, target)
            return await Reflect.apply(method, target, [query, ...ctx])
          }
          catch(reason)
          {
            this._throwOnQueryError(reason, file, query, ctx)
          }
        }
      }
    })
  }

  async getQuery(file, ctx)
  {
    const buffer = file in this.queries
    ? this.queries[file]
    : this.queries[file] = await readFile(this.queryPath + file + this.fileSuffix)

    let query = buffer.toString()

    while(ctx.length && query.indexOf('?%s') > -1)
    {
      query = query.replace('?%s', ctx.shift())
    }

    return query
  }

  _throwOnQueryError(reason, file, query, ctx)
  {
    const error = new Error(`DB query '${file}' failed`)
    error.code  = 'DB_QUERY_ERROR'
    error.query = this.adaptor.getFormattedQuery?.(query, ...ctx) ?? query
    error.cause = reason
    throw error
  }
}

module.exports = Db
