import { AbstractController } from '@/controllers/abstract/controller';
import type { RouteValidationError, SchemaValidationError, UniquenessConstraintError } from '@/entities/error';
import type { Session } from '@/entities/session';
import { AuthInteractor } from '@/interactors/auth';
import { UserInteractor } from '@/interactors/user';
import passport from 'passport';
import { Body, Get, Middlewares, Post, Request, Response, Route, Security, Tags } from 'tsoa';
import type { SignInPayload, SignUpPayload } from './model';

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
  async signIn(@Request() req: Express.AuthenticatedRequest, @Body() body: SignInPayload) {
    if (!req.session.cookie.expires) throw new Error('Session cookie must have expiration date');

    const session: Session = {
      sid: req.sessionID,
      expires: req.session.cookie.expires.toISOString(),
      user: req.user,
    };

    return { session };
  }

  @Post('sign-out')
  @Security('cookie')
  @Response<string>(401, 'Unauthorized')
  async signOut(@Request() req: Express.AuthenticatedRequest) {
    await new AuthInteractor().signOut(req);

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
