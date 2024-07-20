import {
  Controller,
  Body,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
} from 'tsoa';
import { UsersService } from './service';
import type { User } from './model';

@Route('users')
export class UsersController extends Controller {
  @Get('{id}')
  getUser(
    @Path() id: string,
  ) {
    return new UsersService().get(id);
  }

  @Post()
  @SuccessResponse('201', 'Created')
  createUser(
    @Body() requestBody: Omit<User, 'id'>,
  ) {
    this.setStatus(201);
    return new UsersService().create(requestBody);
  }
}
