import { AbstractController } from '@/controllers/abstract/controller';
import type { RouteValidationError } from '@/entities/error';
import { CarInteractor } from '@/interactors/car';
import { Get, Path, Response, Route, Tags } from 'tsoa';

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
}
