import { server } from './server';

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 4000;

server.listen(port, host, () => {
  console.log(`Server listen on http://${host}:${port}`);
});
