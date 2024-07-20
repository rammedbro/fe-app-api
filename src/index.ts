import process from 'node:process';
import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import { RegisterRoutes } from './routes';

dotenv.config();

const app = express();
app
  .use(urlencoded({ extended: true }))
  .use(json());

RegisterRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listen on http://localhost:${ port }`);
});
