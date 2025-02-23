import createHttpError from 'http-errors';
import passport from 'passport';
import { Body, Get, Post, Request, Response, Route, Tags, Middlewares, Security } from 'tsoa';
import { promisify } from 'node:util';
import { AbstractController } from '@/controllers/abstract/controller';
import { UserInteractor } from '@/interactors/user';
import type { Session } from '@/entities/session';
import type { RouteValidationError, SchemaValidationError, UniquenessConstraintError } from '@/entities/error';
import type { SignUpPayload, SignInPayload } from './model';

@Route('auth')
@Tags('auth')
@Response<string>(500, 'Internal server error')
export class AuthController extends AbstractController {
  @Post('sign-up')
  @Response<RouteValidationError>(400, 'Invalid request payload')
  @Response<UniquenessConstraintError>(409, 'Uniqueness constraint violation')
  @Response<SchemaValidationError>(422, 'Invalid schema implementation')
  async signUp(@Body() body: SignUpPayload) {
    await new UserInteractor().addUser({
      email: body.email,
      password: body.password,
      name: undefined,
      lastname: undefined,
      phone: undefined,
      city: undefined,
      address: undefined,
      avatar: undefined,
    });
  }

  @Post('sign-in')
  @Middlewares(passport.authenticate('local'))
  @Response<RouteValidationError>(400, 'Invalid request payload')
  @Response<string>(401, 'Unauthorized')
  async signIn(@Request() req: Express.Request, @Body() body: SignInPayload) {
    if (!req.user) throw createHttpError(401, 'Unauthorized');
    if (!req.session.cookie.expires) throw new Error('Session cookie must have expiration date');

    const session: Session = {
      sid: req.sessionID,
      expires: req.session.cookie.expires.toISOString(),
      user: req.user,
    };

    return { session };
  }

  @Post('sign-out')
  @Security('auth')
  @Response<string>(401, 'Unauthorized')
  async signOut(@Request() req: Express.AuthenticatedRequest) {
    const logout = promisify(req.logout);
    const destroy = promisify(req.session.destroy.bind(req.session));

    await logout();
    await destroy();

    return { session: null };
  }

  @Get('session')
  async getSession(@Request() req: Express.Request) {
    if (!req.user) return { session: null };
    if (!req.session.cookie.expires) throw new Error('Session cookie must have expiration date');

    const session: Session = {
      sid: req.sessionID,
      expires: req.session.cookie.expires.toISOString(),
      user: req.user,
    };

    return { session };
  }
}
