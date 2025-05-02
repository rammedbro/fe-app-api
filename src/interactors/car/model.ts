import type { Car, CarSteering, CarType } from '@/entities/car';
import type { PaginationOptions } from '@/entities/pagination';
import type { Review } from '@/entities/review';
import type { SortOptions } from '@/entities/sort';
import type { Decimal } from '@/shared/models/decimal';

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
  search?: string;
}

export interface GetCarListOptions extends PaginationOptions, GetCarListFilter, SortOptions {}
