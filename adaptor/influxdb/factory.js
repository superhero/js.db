const AdaptorInfluxDb = require('.')

class AdaptorInfluxDbFactory
{
  create(influxdb, escape)
  {
    return new AdaptorInfluxDb(influxdb, escape)
  }
}

module.exports = AdaptorInfluxDbFactory
