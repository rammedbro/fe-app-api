import { redis } from '@/repositories/redis/client';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import process from 'node:process';

const isProduction = process.env.NODE_ENV === 'production';
const middleware = session({
  name: 'sid',
  secret: process.env.SESSION_SECRET as string,
  store: new RedisStore({ client: redis, prefix: 'sid:' }),
  resave: false,
  rolling: true,
  saveUninitialized: false,
  proxy: isProduction,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    httpOnly: true,
    domain: process.env.FRONTEND_HOST,
    path: '/',
    maxAge: 60 * 60 * 1000,
  },
});

export { middleware as session };
