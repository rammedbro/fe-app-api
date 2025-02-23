import { Body, Get, Patch, Post, Queries, Response, Route, Security, SuccessResponse, Tags, Request } from 'tsoa';
import { AbstractController } from '@/controllers/abstract/controller';
import { UserInteractor } from '@/interactors/user';
import type { RouteValidationError } from '@/entities/error';
import type {
  AddFavoritePayload,
  AddOrderPayload,
  GetFavoriteListOptions,
  GetNotificationListOptions,
  GetOrderListOptions,
  UpdateNotificationOptions,
} from '@/interactors/user';

@Route('user')
@Tags('user')
@Security('auth')
@Response<RouteValidationError>(400, 'Invalid request payload')
@Response<string>(401, 'Unauthorized')
@Response<string>(500, 'Internal server error')
export class UserController extends AbstractController {
  @Get()
  async getUser(@Request() req: Express.AuthenticatedRequest) {
    return new UserInteractor().getUser(req.user.id);
  }

  @Get('favorites')
  async getFavoriteList(@Request() req: Express.AuthenticatedRequest, @Queries() options: GetFavoriteListOptions) {
    const { items, page, limit, count } = await new UserInteractor().getFavoriteList(req.user.id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Post('favorites')
  @SuccessResponse('201', 'Created')
  async addFavorite(@Request() req: Express.AuthenticatedRequest, @Body() body: AddFavoritePayload) {
    this.setStatus(201);

    return new UserInteractor().addFavorite(req.user.id, body);
  }

  @Get('notifications')
  async getNotificationList(
    @Request() req: Express.AuthenticatedRequest,
    @Queries() options: GetNotificationListOptions
  ) {
    const { items, page, limit, count } = await new UserInteractor().getNotificationList(req.user.id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Patch('notifications')
  async readNotifications(@Request() req: Express.AuthenticatedRequest, @Queries() options: UpdateNotificationOptions) {
    await new UserInteractor().updateNotification(req.user.id, { isSeen: true }, options);
  }

  @Get('orders')
  async getOrderList(@Request() req: Express.AuthenticatedRequest, @Queries() options: GetOrderListOptions) {
    const { items, page, limit, count } = await new UserInteractor().getOrderList(req.user.id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Post('orders')
  @SuccessResponse('201', 'Created')
  async addOrder(@Request() req: Express.AuthenticatedRequest, @Body() body: AddOrderPayload) {
    this.setStatus(201);

    return new UserInteractor().addOrder(req.user.id, body);
  }
}
