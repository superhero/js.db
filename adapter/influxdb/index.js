const TransactionsNotAllowed = require('./error/transactions-not-allowed')

class AdapterInfluxDb
{
  constructor(influxdb, escape)
  {
    this.influxdb = influxdb
    this.escape   = escape
  }

  async query(template, ctx)
  {
    // escaping input
    for(const i in ctx)
      ctx[i] = this.escape.stringLit(ctx[i])

    // composing query
    const
    parts     = template.split('?'),
    last      = parts.pop(),
    composed  = parts.reduce((result, value, i) => result.concat(value, ctx[i]), []),
    query     = composed.join('') + last,
    result    = await this.influxdb.queryRaw(query)

    return result
  }

  async createTransaction()
  {
    throw new TransactionsNotAllowed('InfluxDb transactions are not available')
  }

  close()
  {
    // no need to close an http request, which influxdb is based on...
  }
}

module.exports = AdapterInfluxDb
