const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis = null;

const getRedisClient = () => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.error('Redis error:', err.message));
    redis.on('close', () => logger.warn('Redis connection closed'));
  }
  return redis;
};

module.exports = { getRedisClient };
