import type { Car } from '@/entities/car';
import type { PaginatedList } from '@/entities/pagination';
import { AbstractInteractor } from '@/interactors/abstract';
import { prisma } from '@/repositories/prisma/client';
import type { GetCarListOptions, GetCarReturn } from './model';

export class CarInteractor extends AbstractInteractor {
  async getCar(id: number): Promise<GetCarReturn> {
    const { _count, ...car } = await prisma.car.findUniqueOrThrow({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, lastname: true, avatar: true },
            },
          },
        },
        _count: {
          select: {
            carViews: true,
          },
        },
      },
    });

    return { ...car, views: _count.carViews };
  }

  async getCarList(options: Partial<GetCarListOptions> = {}): Promise<PaginatedList<Car>> {
    const [brand, ...model] = options.search?.trim().split(' ') || [];
    const where = {
      type: { in: options.type },
      steering: { in: options.steering },
      capacity: { in: options.capacity },
      gasoline: { lte: options.gasoline },
      price: { lte: options.price },
      brand: { contains: brand, mode: 'insensitive' as const },
      model: { contains: model.join(' '), mode: 'insensitive' as const },
    };
    const { page = 1, limit = CarInteractor.PAGINATION_LIMIT, sortDir = CarInteractor.SORT_DIRECTION } = options;
    const items = await prisma.car.findMany({
      skip: CarInteractor.toOffsetPagination(page, limit),
      take: limit,
      where,
      orderBy: options.sortBy?.map((field) => ({ [field]: sortDir })),
    });
    const count = await prisma.car.count({ where });

    return { items, page, limit, count };
  }

  async addView(id: number, payload: number) {
    await prisma.car.update({
      where: { id },
      data: {
        carViews: {
          create: {
            userId: payload,
          },
        },
      },
    });
  }
}
