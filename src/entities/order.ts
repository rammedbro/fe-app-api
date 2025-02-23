import type { Car } from '@/entities/car';
import type { OrderDBModel } from '@/shared/models';

export interface Order extends OrderDBModel {
  car: Car;
}
