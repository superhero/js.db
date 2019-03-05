const AdaptorMySql = require('.')

class AdaptorMySqlFactory
{
  create(mysql, config)
  {
    const pool = mysql.createPool(config)
    return new AdaptorMySql(pool)
  }
}

module.exports = AdaptorMySqlFactory
