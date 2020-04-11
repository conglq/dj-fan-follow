module.exports = {
  http: {
    port: process.env.PORT || 9999
  },
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379/3',
  index: {
    maxFanIndex: 1
  }
}