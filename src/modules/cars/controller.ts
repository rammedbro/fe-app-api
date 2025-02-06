import { Get, Path, Route, Tags, Response, Post, SuccessResponse, Body, Queries } from 'tsoa';
import { AbstractController } from '@/controller';
import type { ValidationError } from '@/types';
import { CarsService } from './service';
import type { AddReviewPayload, GetCarListOptions, GetReviewListOptions } from './model';

@Route('cars')
@Tags('cars')
export class CarsController extends AbstractController {
  @Get()
  async getCarList(@Queries() options: GetCarListOptions) {
    const { items, page, limit, count } = await new CarsService().getCarList(options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }

  @Get('{id}')
  @Response(404, 'Car not found')
  async getCar(@Path() id: number) {
    const service = new CarsService();
    const car = await service.getCar(id);

    if (!car) {
      this.setStatus(404);
      return;
    }

    return car;
  }

  @Get('{id}/reviews')
  @Response(404, 'Car not found')
  async getReviewList(@Path() id: number, @Queries() options: GetReviewListOptions) {
    try {
      const { items, page, limit, count } = await new CarsService().getReviewList(id, options);
      this.setPaginationHeaders(page, limit, count);

      return items;
    } catch {
      this.setStatus(404);
    }
  }

  @Post('{id}/reviews')
  @SuccessResponse('201', 'Created')
  @Response<ValidationError>(422, 'Validation Failed')
  async addReview(@Path() id: number, @Body() body: AddReviewPayload) {
    this.setStatus(201);
    return new CarsService().addReview(id, body);
  }
}
