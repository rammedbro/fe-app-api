import type { Car } from '@/entities/car';
import type { OrderDBModel } from '@/repositories/prisma/models';

export interface Order extends OrderDBModel {
  car: Car;
}
