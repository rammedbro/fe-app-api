import { Get, Path, Route, Tags, Response, Post, SuccessResponse, Body, Queries } from 'tsoa';
import { AbstractController } from '@/controllers/abstract/controller';
import { CarInteractor } from '@/interactors/car';
import type { RouteValidationError } from '@/entities/error';
import type { AddReviewPayload, GetReviewListOptions } from '@/interactors/car';

@Route('cars/{id}')
@Tags('cars')
@Response<RouteValidationError>(400, 'Invalid request payload')
@Response<string>(404, 'Not found')
@Response<string>(500, 'Internal server error')
export class CarController extends AbstractController {
  @Get()
  async getCar(@Path() id: number) {
    return new CarInteractor().getCar(id);
  }

  @Get('reviews')
  async getReviewList(@Path() id: number, @Queries() options: GetReviewListOptions) {
    const { items, page, limit, count } = await new CarInteractor().getReviewList(id, options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Post('reviews')
  @SuccessResponse('201', 'Created')
  async addReview(@Path() id: number, @Body() body: AddReviewPayload) {
    this.setStatus(201);

    return new CarInteractor().addReview(id, body);
  }
}
