import type { CarDBModel, CarSteering, CarType } from '@/repositories/prisma/models';

export interface Car extends CarDBModel {}

export type { CarSteering, CarType };
