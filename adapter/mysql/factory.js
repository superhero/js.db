const AdapterMySql = require('.')

class AdapterMySqlFactory
{
  create(mysql, config)
  {
    const pool = mysql.createPool(config)
    return new AdapterMySql(pool)
  }
}

module.exports = AdapterMySqlFactory
