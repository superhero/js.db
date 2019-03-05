const AdaptorRedis = require('.')

class AdaptorRedisFactory
{
  create(redis, options)
  {
    const client = redis.createClient(options)
    return new AdaptorRedis(client)
  }
}

module.exports = AdaptorRedisFactory
