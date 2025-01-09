import {
  Controller,
  Body,
  Get,
  Path,
  Post,
  Route,
  Tags,
  Response,
  SuccessResponse,
  Query,
} from 'tsoa';
import { UsersService } from './service';
import type { User, UserCreationParams } from './model';
import type { ValidationError } from '@/types/errors';

@Route('users')
@Tags('users')
export class UsersController extends Controller {
  /**
   * Retrieves a list of users with pagination.
   *
   * @param page The page number for pagination. Default is 1.
   * @param limit The number of users per page. Default is 25.
   * @returns An array of users
   */
  @Get()
  async getUsers(
    /**
     * @type number
     * @format int32
     */
    @Query() page: number = 1,
    /**
     * @type number
     * @format int32
     */
    @Query() limit: number = 25,
  ): Promise<User[]> {
    const service = new UsersService();
    const users = await service.getPaginated(page, limit);
    const totalCount = await service.getTotalCount();

    this.setHeader('x-page', page);
    this.setHeader('x-prev-page', page > 0 ? page - 1 : 0);
    this.setHeader('x-next-page', users.meta.page.more ? page + 1 : 0);
    this.setHeader('x-per-page', limit);
    this.setHeader('x-total-count', totalCount);

    return users.records.toArray();
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id The unique identifier of the user to retrieve.
   * @returns The user object
   */
  @Get('{id}')
  @Response(404, 'User not found')
  async getUser(
    @Path() id: string,
  ) {
    const user = await new UsersService().get(id);

    if (!user) {
      this.setStatus(404);
      return;
    }

    return user;
  }

  /**
   * Creates a new user using the provided data.
   *
   * @param requestBody The data required to create a new user.
   * @returns The newly created user object.
   */
  @Post()
  @Response<ValidationError>(422, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  createUser(
    @Body() requestBody: UserCreationParams,
  ) {
    this.setStatus(201);
    return new UsersService().create(requestBody);
  }
}
