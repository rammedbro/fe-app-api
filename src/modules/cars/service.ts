import { db } from '@/db';
import { AbstractService } from '@/service';
import type { PaginatedList } from '@/types';
import type { AddReviewPayload, Car, GetCarListOptions, GetCarReturn, GetReviewListOptions, Review } from './model';

export class CarsService extends AbstractService {
  async getCar(id: number): Promise<GetCarReturn | null> {
    const result = await db.car.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: true },
        },
        _count: {
          select: {
            carViews: true,
          },
        },
      },
    });

    if (result === null) {
      return null;
    }

    const { _count, ...car } = result;
    return { ...car, views: _count.carViews };
  }

  async getCarList(options: Partial<GetCarListOptions> = {}): Promise<PaginatedList<Car>> {
    const where = {
      type: { in: options.type },
      steering: { in: options.steering },
      capacity: { in: options.capacity },
      gasoline: { lte: options.gasoline },
      price: { lte: options.price },
    };
    const { page = 1, limit = CarsService.PAGINATION_LIMIT, sortDir = CarsService.SORT_DIRECTION } = options;
    const items = await db.car.findMany({
      skip: CarsService.toOffsetPagination({ page, limit }),
      take: limit,
      where,
      orderBy: options.sortBy?.map((field) => ({ [field]: sortDir })),
    });
    const count = await db.car.count({ where });

    return { items, page, limit, count };
  }

  async getReviewList(id: number, options: Partial<GetReviewListOptions> = {}): Promise<PaginatedList<Review>> {
    const { page = 1, limit = CarsService.PAGINATION_LIMIT, sortDir = CarsService.SORT_DIRECTION } = options;
    const { reviews, _count } = await db.car.findUniqueOrThrow({
      where: { id },
      select: {
        reviews: {
          include: { user: true },
          skip: CarsService.toOffsetPagination({ page, limit }),
          take: limit,
          orderBy: options.sortBy?.map((field) => ({ [field]: sortDir })),
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    return { items: reviews, page, limit, count: _count.reviews };
  }

  async addReview(id: number, payload: AddReviewPayload): Promise<Review> {
    const { reviews } = await db.car.update({
      where: { id },
      data: {
        reviews: {
          create: payload,
        },
      },
      select: {
        reviews: {
          include: { user: true },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return reviews.pop()!;
  }

  async addView(id: number, payload: number) {
    await db.car.update({
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
