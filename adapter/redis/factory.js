const AdapterRedis = require('.')

class AdapterRedisFactory
{
  create(redis, options)
  {
    const client = redis.createClient(options)
    return new AdapterRedis(client)
  }
}

module.exports = AdapterRedisFactory
