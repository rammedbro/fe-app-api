import { Car } from '@/entities/car';
import type { FavoriteDBModel } from '@/repositories/prisma/models';

export interface Favorite extends FavoriteDBModel {
  car: Car;
}
