import { Get, Route, Tags, Queries, Response } from 'tsoa';
import { AbstractController } from '@/controllers/abstract/controller';
import { CarInteractor, type GetCarListOptions } from '@/interactors/car';

@Route('cars')
@Tags('cars')
@Response<string>(500, 'Internal server error')
export class CarsController extends AbstractController {
  @Get()
  async getCarList(@Queries() options: GetCarListOptions) {
    const { items, page, limit, count } = await new CarInteractor().getCarList(options);

    this.setPaginationHeaders(page, limit, count);

    return items;
  }
}
