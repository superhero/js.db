const AdapterInfluxDb = require('.')

class AdapterInfluxDbFactory
{
  create(influxdb, escape)
  {
    return new AdapterInfluxDb(influxdb, escape)
  }
}

module.exports = AdapterInfluxDbFactory
