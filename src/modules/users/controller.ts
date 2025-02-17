import { Body, Get, Patch, Path, Post, Queries, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { AbstractController } from '@/controller';
import type { RouteValidationError } from '@/types';
import type {
  AddFavoritePayload,
  AddOrderPayload,
  GetFavoriteListOptions,
  GetNotificationListOptions,
  GetOrderListOptions,
  GetUserListOptions,
  UpdateNotificationOptions,
  UpdateUserPayload,
} from './model';
import { UsersService } from './service';

@Route('users')
@Tags('users')
export class UsersController extends AbstractController {
  /**
   * Retrieves a list of users with pagination.
   */
  @Get()
  async getUserList(@Queries() options: GetUserListOptions) {
    const { items, page, limit, count } = await new UsersService().getUserList(options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id The unique identifier of the user to retrieve.
   * @returns The user object
   */
  @Get('{id}')
  @Response(404, 'User not found')
  async getUser(@Path() id: number) {
    const user = await new UsersService().getUser(id);

    if (!user) {
      this.setStatus(404);
      return;
    }

    return user;
  }

  @Patch('{id}')
  @Response(404, 'User not found')
  async updateUser(@Path() id: number, @Body() body: UpdateUserPayload) {
    try {
      await new UsersService().updateUser(id, body);
    } catch {
      this.setStatus(404);
    }
  }

  @Get('{id}/favorites')
  async getFavoriteList(@Path() id: number, @Queries() options: GetFavoriteListOptions) {
    const { items, page, limit, count } = await new UsersService().getFavoriteList(id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Post('{id}/favorites')
  @SuccessResponse('201', 'Created')
  @Response<RouteValidationError>(400, 'Invalid request payload')
  async addFavorite(@Path() id: number, @Body() body: AddFavoritePayload) {
    return new UsersService().addFavorite(id, body);
  }

  @Get('{id}/notifications')
  @Response(404, 'User not found')
  async getNotificationList(@Path() id: number, @Queries() options: GetNotificationListOptions) {
    try {
      const { items, page, limit, count } = await new UsersService().getNotificationList(id, options);

      this.setPaginationHeaders(page, limit, count);

      return items;
    } catch {
      this.setStatus(404);
    }
  }

  @Patch('{id}/notifications')
  @Response(404, 'User not found')
  async readNotifications(@Path() id: number, @Queries() options: UpdateNotificationOptions) {
    try {
      await new UsersService().updateNotification(id, { isSeen: true }, options);
    } catch {
      this.setStatus(404);
    }
  }

  @Get('{id}/orders')
  @Response(404, 'User not found')
  async getOrderList(@Path() id: number, @Queries() options: GetOrderListOptions) {
    try {
      const { items, page, limit, count } = await new UsersService().getOrderList(id, options);

      this.setPaginationHeaders(page, limit, count);

      return items;
    } catch {
      this.setStatus(404);
    }
  }

  @Post('{id}/orders')
  @SuccessResponse('201', 'Created')
  @Response<RouteValidationError>(400, 'Invalid request payload')
  async addOrder(@Path() id: number, @Body() body: AddOrderPayload) {
    this.setStatus(201);
    return new UsersService().addOrder(id, body);
  }
}
