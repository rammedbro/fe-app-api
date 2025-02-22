import { Body, Get, Patch, Post, Queries, Response, Route, Security, SuccessResponse, Tags, Request } from 'tsoa';
import { AbstractController } from '@/controller';
import type { RouteValidationError } from '@/types';
import type {
  AddFavoritePayload,
  AddOrderPayload,
  GetFavoriteListOptions,
  GetNotificationListOptions,
  GetOrderListOptions,
  UpdateNotificationOptions,
} from './model';
import { UsersService } from './service';

@Route('user')
@Tags('user')
@Security('auth')
@Response<string>(401, 'Unauthorized')
@Response<string>(500, 'Internal server error')
export class UserController extends AbstractController {
  @Get()
  @Response<string>(404, 'User not found')
  async getUser(@Request() req: Express.Request) {
    const user = await new UsersService().getUser(req.user!.id);

    if (!user) {
      this.setStatus(404);
      return;
    }

    return user;
  }

  @Get('favorites')
  async getFavoriteList(@Request() req: Express.Request, @Queries() options: GetFavoriteListOptions) {
    const { items, page, limit, count } = await new UsersService().getFavoriteList(req.user!.id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Post('favorites')
  @SuccessResponse('201', 'Created')
  @Response<RouteValidationError>(400, 'Invalid request payload')
  async addFavorite(@Request() req: Express.Request, @Body() body: AddFavoritePayload) {
    return new UsersService().addFavorite(req.user!.id, body);
  }

  @Get('notifications')
  async getNotificationList(@Request() req: Express.Request, @Queries() options: GetNotificationListOptions) {
    const { items, page, limit, count } = await new UsersService().getNotificationList(req.user!.id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Patch('notifications')
  async readNotifications(@Request() req: Express.Request, @Queries() options: UpdateNotificationOptions) {
    await new UsersService().updateNotification(req.user!.id, { isSeen: true }, options);
  }

  @Get('orders')
  async getOrderList(@Request() req: Express.Request, @Queries() options: GetOrderListOptions) {
    const { items, page, limit, count } = await new UsersService().getOrderList(req.user!.id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Post('orders')
  @SuccessResponse('201', 'Created')
  @Response<RouteValidationError>(400, 'Invalid request payload')
  async addOrder(@Request() req: Express.Request, @Body() body: AddOrderPayload) {
    this.setStatus(201);
    return new UsersService().addOrder(req.user!.id, body);
  }
}
