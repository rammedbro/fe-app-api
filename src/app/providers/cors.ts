import cors from 'cors';

const middleware = cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  exposedHeaders: ['x-page', 'x-prev-page', 'x-next-page', 'x-per-page', 'x-total-count'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 24 * 60 * 60 * 1000,
});

export { middleware as cors };
