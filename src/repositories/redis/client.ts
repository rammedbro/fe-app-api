import process from 'node:process';
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.connect().catch(console.error);

export { redis };
