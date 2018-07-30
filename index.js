const
Transaction = require('./transaction'),
path        = require('path'),
util        = require('util'),
fs          = require('fs'),
promisify   = util.promisify,
readFile    = promisify(fs.readFile)

module.exports = class
{
  get pool()
  {
    return this._pool
    ? this._pool
    : this._pool = require('mysql').createPool(this.settings)
  }

  constructor(connectionLimit, host, user, password, sqlPath)
  {
    this.settings   = { connectionLimit, host, user, password }
    this.sqlPath    = path.normalize(sqlPath) + '/'
    this._query     = promisify(this.pool.query.bind(this.pool))
    this.templates  = {}
  }

  async query(file, ...ctx)
  {
    const
    template = await this.getTemplate(file),
    response = await this._query(template, ...ctx)

    return response
  }

  async createTransaction()
  {
    const
    getConnection = promisify(this.pool.getConnection.bind(this.pool)),
    connection    = await getConnection(),
    transaction   = new Transaction(this, connection)

    await transaction.query('START TRANSACTION')

    return transaction
  }

  async getTemplate(file)
  {
    const template = file in this.templates
    ? this.templates[file]
    : this.templates[file] = await readFile(this.sqlPath + file + '.sql')
    return template.toString()
  }
}
