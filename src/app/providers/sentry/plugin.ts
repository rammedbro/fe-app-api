import type { Plugin } from '@/app/ui/app';
import Sentry from '@sentry/node';

export const sentry: Plugin<{}> = (app) => {
  Sentry.setupExpressErrorHandler(app);
};
