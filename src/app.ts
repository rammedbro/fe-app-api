import express, { json, Request, Response, urlencoded } from 'express';
import fs from 'node:fs/promises';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { ValidateError } from 'tsoa';
import { RegisterRoutes } from './routes';
import type { ValidationError } from './types';

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    exposedHeaders: ['x-page', 'x-prev-page', 'x-next-page', 'x-per-page', 'x-total-count'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 24 * 60 * 60,
  })
);
app.use(urlencoded({ extended: true }));
app.use(json());

// Routes
RegisterRoutes(app);
app.use('/docs', swaggerUi.serve, async (req: Request, res: Response) => {
  const json = JSON.parse(await fs.readFile('./build/swagger.json', 'utf-8'));

  if (req.query.json) {
    res.send(json);
    return;
  }

  res.send(swaggerUi.generateHTML(json));
});
app.use((_: Request, res: Response) => {
  res.status(404).send('Not Found');
});

// Error handling
app.use((err: unknown, _: Request, res: Response, next: () => void) => {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: 'Validation Failed',
      details: err.fields,
    } as ValidationError);
  }

  if (err instanceof Error) {
    console.error(err.stack);
    return res.status(500).send('Internal Server Error');
  }

  next();
});

export { app };
