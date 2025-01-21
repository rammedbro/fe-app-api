import process from 'node:process';
import { app } from './app';

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 4000;

app.listen(port, host, () => {
  console.log(`Server listen on http://${ host }:${ port }`);
});
