import type { Car, CarType, CarSteering } from '@/entities/car';
import type { Review } from '@/entities/review';
import type { PaginationOptions } from '@/entities/pagination';
import type { SortOptions } from '@/entities/sort';
import type { Decimal } from '@/shared/models';

export interface GetCarReturn extends Car {
  views: number;
  reviews: Review[];
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
  [K in Exclude<keyof Review, 'id' | 'createdAt' | 'carId' | 'user'>]: Review[K];
};
