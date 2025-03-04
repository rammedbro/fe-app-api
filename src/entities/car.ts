import type { CarDBModel, CarType, CarSteering } from '@/repositories/prisma/models';

export interface Car extends CarDBModel {}

export type { CarType, CarSteering };
