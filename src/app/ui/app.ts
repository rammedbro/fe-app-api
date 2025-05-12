import type { Express } from 'express';
import express from 'express';

export type Plugin<Options = undefined> = (app: Express, options: Options) => unknown;

export function createApp(): Express {
  const app = express() as Express;

  app.plugin = (plugin, options) => {
    plugin(app, options);
    return app;
  };

  return app;
}
