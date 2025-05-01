import Sentry from '@sentry/node';
import path from 'node:path';
import process from 'node:process';

const { npm_package_name, npm_package_version } = process.env;

/**
 * @see https://docs.sentry.io/platforms/javascript/guides/express/configuration/options/
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.NODE_ENV,
  release: `${npm_package_name}@${npm_package_version}`,
  sendDefaultPii: true,
  integrations: [
    Sentry.rewriteFramesIntegration({
      root: process.cwd() + path.sep,
      prefix: '/',
    }),
  ],
});
