import express from 'express';

export type Plugin<Options = undefined> = (app: App, options: Options) => unknown;

export interface App extends express.Express {
  plugin<T>(plugin: Plugin<T>, options: T): App;
}

export function createApp(): App {
  const app = express() as unknown as App;

  app.plugin = (plugin, options) => {
    plugin(app, options);
    return app;
  };

  return app;
}
