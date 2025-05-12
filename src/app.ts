import { cors } from '@/app/providers/cors';
import { debug } from '@/app/providers/debug';
import { error } from '@/app/providers/error';
import { passport } from '@/app/providers/passport';
import { router } from '@/app/providers/router/plugin';
import { session } from '@/app/providers/session';
import { createApp } from '@/app/ui/app';
import { AuthInteractor } from '@/interactors/auth';
import { json, urlencoded } from 'express';
import { Strategy } from 'passport-local';

const app = createApp()
  .use(debug)
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(cors)
  .use(session)
  .plugin(passport, {
    strategy: new Strategy(async (username, password, done) => {
      const user = await new AuthInteractor().signIn({ username, password });
      return done(null, user);
    }),
  })
  .plugin(router, {})
  .use(error);

export { app };
