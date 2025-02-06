import type { CarDBModel, CarType, CarSteering, Decimal, ReviewDBModel } from '@/types/models.gen';
import type { PaginationOptions, SortOptions } from '@/types';
import type { User } from '@/modules/users/model';

export interface Car extends CarDBModel {}

export interface GetCarReturn extends Car {
  views: number;
  reviews: Review[];
}

export interface Review extends ReviewDBModel {
  user: User;
}

export interface GetCarListFilter {
  type?: CarType[];
  capacity?: number[];
  steering?: CarSteering[];
  gasoline?: number;
  price?: Decimal;
}

export interface GetCarListOptions extends PaginationOptions, GetCarListFilter, SortOptions {}

export interface GetReviewListOptions extends PaginationOptions, SortOptions {}

export type AddReviewPayload = {
  [K in Exclude<keyof ReviewDBModel, 'id' | 'createdAt' | 'carId'>]: ReviewDBModel[K];
};
