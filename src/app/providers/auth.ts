import createHttpError from 'http-errors';
import type { IncomingMessage } from 'node:http';
import { Socket } from 'socket.io';

type AUTH_METHOD = 'cookie';

export async function expressAuthentication(
  req: Express.Request | IncomingMessage,
  method: AUTH_METHOD
): Promise<Express.User> {
  if (method === 'cookie') {
    if (!req.isAuthenticated()) {
      throw createHttpError(401, 'Not Authorized');
    }

    return req.user;
  }

  throw new Error('Unsupported auth security method');
}

export function socketAuthentication(method: AUTH_METHOD) {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const user = await expressAuthentication(socket.request, method);
      socket.join(user.id.toString());
      next();
    } catch (e) {
      next(e as Error);
    }
  };
}
