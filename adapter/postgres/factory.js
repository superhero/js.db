const AdapterPostgres = require('.')

class AdapterPostgresFactory
{
  create(pg, config)
  {
    const pool = new pg.Pool(config)
    return new AdapterPostgres(pool)
  }
}

module.exports = AdapterPostgresFactory
