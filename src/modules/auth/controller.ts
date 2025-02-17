import { AbstractController } from '@/controller';
import type { SignUpPayload } from './model';
import { UsersService } from '@/modules/users/service';
import type { RouteValidationError, SchemaValidationError, UniquenessConstraintError } from '@/types/errors';
import { Body, Post, Response, SuccessResponse, Route, Tags } from 'tsoa';

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
}
