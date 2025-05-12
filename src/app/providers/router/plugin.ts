import type { Plugin } from '@/app/ui/app';
import type { Request, Response } from 'express';
import { Router } from 'express';
import createHttpError from 'http-errors';
import fs from 'node:fs/promises';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes';

export const router: Plugin<{}> = (app) => {
  const apiRouter = Router();
  RegisterRoutes(apiRouter);

  app.use('/api', apiRouter);
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
