import type { Plugin } from '@/app/ui/app';
import passport from 'passport';
import type { Strategy } from 'passport-local';

interface Options {
  strategy: Strategy;
}

const plugin: Plugin<Options> = (app, options) => {
  passport.use(options.strategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user as Express.User));

  app.use(passport.initialize());
  app.use(passport.session());
};

export { plugin as passport };
