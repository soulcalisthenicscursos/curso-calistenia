import { Redis } from '@upstash/redis';

// Cliente de Redis para Upstash
// En producción, estas variables deben estar en .env.local
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export default redis;

