const
Transaction = require('./transaction'),
util        = require('util'),
mysql       = require('mysql'),
path        = require('path'),
fs          = require('fs'),
promisify   = util.promisify,
readFile    = promisify(fs.readFile)

module.exports = class MySQL
{
  static from(connectionLimit, host, user, password, sqlPath)
  {
    const pool = mysql.createPool({ connectionLimit, host, user, password })
    return new MySQL(pool, sqlPath)
  }

  constructor(pool, sqlPath)
  {
    this.pool       = pool
    this.sqlPath    = path.normalize(sqlPath) + '/'
    this._query     = promisify(pool.query.bind(pool))
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
