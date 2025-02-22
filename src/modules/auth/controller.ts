import { AbstractController } from '@/controller';
import createHttpError from 'http-errors';
import passport from 'passport';
import type { Session, SignInPayload, SignUpPayload } from './model';
import { UsersService } from '@/modules/user/service';
import type { RouteValidationError, SchemaValidationError, UniquenessConstraintError } from '@/types/errors';
import { Body, Get, Post, Request, Response, SuccessResponse, Route, Tags, Middlewares, Security } from 'tsoa';
import { promisify } from 'node:util';

@Route('auth')
@Tags('auth')
@Response<string>(500, 'Internal server error')
export class AuthController extends AbstractController {
  @Post('sign-up')
  @SuccessResponse('201', 'Created')
  @Response<RouteValidationError>(400, 'Invalid request payload')
  @Response<UniquenessConstraintError>(409, 'Uniqueness constraint violation')
  @Response<SchemaValidationError>(422, 'Invalid schema implementation')
  async signUp(@Body() body: SignUpPayload) {
    await new UsersService().addUser({
      email: body.email,
      password: body.password,
      name: undefined,
      lastname: undefined,
      phone: undefined,
      city: undefined,
      address: undefined,
      avatar: undefined,
    });
    this.setStatus(201);
  }

  @Post('sign-in')
  @Middlewares(passport.authenticate('local'))
  @Response<RouteValidationError>(400, 'Invalid request payload')
  @Response<string>(401, 'Invalid login or password')
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
  async signOut(@Request() req: Express.Request) {
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
