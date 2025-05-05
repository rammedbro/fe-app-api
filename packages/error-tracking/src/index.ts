import * as Sentry from '@sentry/node';
import path from 'node:path';
import process from 'node:process';

const { npm_package_name, npm_package_version, NODE_ENV = 'production', SENTRY_DSN, SENTRY_DISABLED } = process.env;

Sentry.initWithoutDefaultIntegrations({
  dsn: SENTRY_DSN,
  enabled: SENTRY_DISABLED !== 'true',
  environment: NODE_ENV,
  release: `${npm_package_name}@${npm_package_version}`,
  sendDefaultPii: true,
  integrations: [
    ...Sentry.getDefaultIntegrationsWithoutPerformance(),
    Sentry.rewriteFramesIntegration({
      root: process.cwd() + path.sep,
      prefix: '/',
    }),
    Sentry.httpIntegration({ spans: false }),
  ],
});
