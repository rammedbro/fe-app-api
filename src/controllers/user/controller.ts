import { AbstractController } from '@/controllers/abstract/controller';
import type { RouteValidationError, SchemaValidationError } from '@/entities/error';
import type {
  AddFavoritePayload,
  AddOrderPayload,
  DelFavoritePayload,
  GetFavoriteListOptions,
  GetNotificationListOptions,
  GetOrderListOptions,
} from '@/interactors/user';
import { UserInteractor } from '@/interactors/user';
import {
  Body,
  Delete,
  Get,
  Path,
  Post,
  Queries,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

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

  @Delete('favorites')
  @SuccessResponse('204', 'Deleted')
  async delFavorite(@Request() req: Express.AuthenticatedRequest, @Body() body: DelFavoritePayload) {
    this.setStatus(204);

    return new UserInteractor().delFavorite(req.user.id, body);
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

  @Get('orders')
  async getOrderList(@Request() req: Express.AuthenticatedRequest, @Queries() options: GetOrderListOptions) {
    const { items, page, limit, count } = await new UserInteractor().getOrderList(req.user.id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Post('orders')
  @SuccessResponse('201', 'Created')
  @Response<SchemaValidationError>(422, 'Invalid schema implementation')
  async addOrder(@Request() req: Express.AuthenticatedRequest, @Body() body: AddOrderPayload) {
    this.setStatus(201);

    return new UserInteractor().addOrder(req.user.id, body);
  }

  @Get('orders/{id}')
  async getOrder(@Path() id: number) {
    return new UserInteractor().getOrder(id);
  }
}
