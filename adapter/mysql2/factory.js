const AdapterMySql2 = require('.')

class AdapterMySql2Factory
{
  create(mysql2, config)
  {
    const pool = mysql2.createPool(config)
    return new AdapterMySql2(pool)
  }
}

module.exports = AdapterMySql2Factory
