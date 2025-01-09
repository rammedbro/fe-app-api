import * as fs from 'node:fs';
import process from 'node:process';
import express, { json, urlencoded, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';
import { RegisterRoutes } from './routes';

dotenv.config();

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
      details: err?.fields,
    });
  }

  if (err instanceof Error) {
    console.error(err.stack);
    return res.status(500).send('Internal Server Error');
  }

  next();
});

// Start server
const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 4000;
app.listen(port, host, () => {
  console.log(`Server listen on http://${ host }:${ port }`);
});
