import debug from 'debug';
import type { Request, Response, NextFunction } from 'express';

const logRequest = debug('app:request');
const logResponse = debug('app:response');

function middleware(req: Request, res: Response, next: NextFunction) {
  if (req.originalUrl.startsWith('/docs')) {
    return next();
  }

  logRequest(`[${req.method}] ${req.originalUrl}`);
  logRequest('Headers:', req.headers);
  logRequest('Body:', req.body);

  const send = res.send;
  res.send = function (...args) {
    logResponse(`Status: ${res.statusCode} ${res.statusMessage}`);
    logResponse('Body:', ...args);

    send.call(res, ...args);

    return res;
  };

  next();
}

export { middleware as debug };
