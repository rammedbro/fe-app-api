import express, { json, Request, Response, urlencoded } from 'express';
import fs from 'node:fs';
import swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';
import { RegisterRoutes } from './routes';
import type { ValidationError } from './types';

const app = express();

// Middlewares
app.use(urlencoded({ extended: true }));
app.use(json());

// Routes
RegisterRoutes(app);
app.use('/docs', swaggerUi.serve, (_: Request, res: Response) => {
  const json = JSON.parse(fs.readFileSync('./build/swagger.json', 'utf-8'));
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
