import { SignInPayload } from '@/controllers/auth/model';
import { AbstractInteractor } from '@/interactors/abstract';
import { UserSocket } from '@/interactors/user';
import { prisma } from '@/repositories/prisma/client';
import argon from 'argon2';
import createHttpError from 'http-errors';
import { promisify } from 'node:util';

export class AuthInteractor extends AbstractInteractor {
  async signIn(payload: SignInPayload) {
    const user = await prisma.user.findUnique({
      where: { email: payload.username },
    });

    if (!user || !(await argon.verify(user.password, payload.password))) {
      throw createHttpError(401, 'Incorrect login or password');
    }

    const { id, email, name, lastname, avatar } = user;

    return { id, email, name, lastname, avatar };
  }

  async signOut(req: Express.AuthenticatedRequest) {
    const logout = promisify(req.logout);
    const destroy = promisify(req.session.destroy.bind(req.session));

    await logout();
    await destroy();

    new UserSocket(req.user.id).emit('signOut');
  }
}
