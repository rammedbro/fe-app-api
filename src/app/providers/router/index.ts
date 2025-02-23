import type { Plugin } from '@/app/ui/app';
import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import fs from 'node:fs/promises';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes';

export const router: Plugin = (app) => {
  RegisterRoutes(app);

  app.use('/docs', swaggerUi.serve, async (req: Request, res: Response) => {
    const json = JSON.parse(await fs.readFile('./build/swagger.json', 'utf-8'));

    if (req.query.json) {
      res.send(json);
      return;
    }

    res.send(swaggerUi.generateHTML(json));
  });

  app.use(() => {
    throw createHttpError(404, 'Not Found');
  });
};
