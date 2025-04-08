const { createClient } = require('redis');

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Redis Client Error', err));

const DEFAULT_TTL = 86400; // 24 hours in seconds

async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
}

async function setParcel(parcelId, data, ttl = DEFAULT_TTL) {
  await redis.set(`PARCEL:${parcelId}`, JSON.stringify(data), { EX: ttl });
}

async function getParcel(parcelId) {
  const raw = await redis.get(`PARCEL:${parcelId}`);
  return raw ? JSON.parse(raw) : null;
}

async function deleteParcel(parcelId) {
  await redis.del(`PARCEL:${parcelId}`);
}

module.exports = {
  redis,
  connectRedis,
  setParcel,
  getParcel,
  deleteParcel,
};
