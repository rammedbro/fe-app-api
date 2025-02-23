import createHttpError from 'http-errors';

export async function expressAuthentication(req: Express.Request, securityName: string): Promise<Express.User> {
  if (securityName === 'auth') {
    if (!req.isAuthenticated()) {
      throw createHttpError(401, 'Not Authorized');
    }

    return req.user;
  }

  throw new Error('Unsupported auth security method');
}
