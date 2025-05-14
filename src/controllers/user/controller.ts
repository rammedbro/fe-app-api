import { AbstractController } from '@/controllers/abstract/controller';
import type { RouteValidationError, SchemaValidationError, UniquenessConstraintError } from '@/entities/error';
import type {
  AddOrderPayload,
  AddReviewPayload,
  BulkFavoritePayload,
  GetFavoriteListOptions,
  GetNotificationListOptions,
  GetOrderAggregationOptions,
  GetOrderListOptions,
  GetReviewListOptions,
} from '@/interactors/user';
import { UserInteractor } from '@/interactors/user';
import { Body, Get, Path, Post, Queries, Request, Response, Route, Security, SuccessResponse, Tags } from 'tsoa';

@Route('user')
@Tags('user')
@Security('cookie')
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

  @Post('favorites/bulk')
  @SuccessResponse(204, 'No Content')
  @Response<UniquenessConstraintError>(409, 'Uniqueness constraint violation')
  async bulkFavorite(@Request() req: Express.AuthenticatedRequest, @Body() body: BulkFavoritePayload) {
    this.setStatus(204);

    return new UserInteractor().bulkFavorite(req.user.id, body);
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
  @SuccessResponse(201, 'Created')
  @Response<SchemaValidationError>(422, 'Invalid schema implementation')
  async addOrder(@Request() req: Express.AuthenticatedRequest, @Body() body: AddOrderPayload) {
    this.setStatus(201);

    return new UserInteractor().addOrder(req.user.id, body);
  }

  @Get('orders/current')
  @Response(404, 'Not Found')
  async getCurrentOrder(@Request() req: Express.AuthenticatedRequest) {
    return new UserInteractor().getCurrentOrder(req.user.id);
  }

  @Get('orders/aggregation')
  async getOrderAggregation(
    @Request() req: Express.AuthenticatedRequest,
    @Queries() options: GetOrderAggregationOptions
  ) {
    return new UserInteractor().getOrderAggregation(req.user.id, options);
  }

  @Get('orders/{id}')
  @Response(404, 'Not Found')
  async getOrder(@Path() id: number) {
    return new UserInteractor().getOrder(id);
  }

  @Get('reviews')
  async getReviewList(@Request() req: Express.AuthenticatedRequest, @Queries() options: GetReviewListOptions) {
    const { items, page, limit, count } = await new UserInteractor().getReviewList(req.user.id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Post('reviews')
  @SuccessResponse(201, 'Created')
  @Response<SchemaValidationError>(422, 'Invalid schema implementation')
  async addReview(@Request() req: Express.AuthenticatedRequest, @Body() body: AddReviewPayload) {
    this.setStatus(201);

    return new UserInteractor().addReview(req.user.id, body);
  }
}
