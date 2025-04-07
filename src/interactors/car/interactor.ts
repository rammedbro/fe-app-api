import type { Car } from '@/entities/car';
import type { PaginatedList } from '@/entities/pagination';
import type { Review } from '@/entities/review';
import { AbstractInteractor } from '@/interactors/abstract';
import { prisma } from '@/repositories/prisma/client';
import type { AddReviewPayload, GetCarListOptions, GetCarReturn, GetReviewListOptions } from './model';

export class CarInteractor extends AbstractInteractor {
  async getCar(id: number): Promise<GetCarReturn> {
    const { _count, ...car } = await prisma.car.findUniqueOrThrow({
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
    const { page = 1, limit = CarInteractor.PAGINATION_LIMIT, sortDir = CarInteractor.SORT_DIRECTION } = options;
    const items = await prisma.car.findMany({
      skip: CarInteractor.toOffsetPagination({ page, limit }),
      take: limit,
      where,
      orderBy: options.sortBy?.map((field) => ({ [field]: sortDir })),
    });
    const count = await prisma.car.count({ where });

    return { items, page, limit, count };
  }

  async getReviewList(id: number, options: Partial<GetReviewListOptions> = {}): Promise<PaginatedList<Review>> {
    const { page = 1, limit = CarInteractor.PAGINATION_LIMIT, sortDir = CarInteractor.SORT_DIRECTION } = options;
    const { reviews, _count } = await prisma.car.findUniqueOrThrow({
      where: { id },
      select: {
        reviews: {
          include: { user: { select: { name: true, lastname: true, avatar: true } } },
          skip: CarInteractor.toOffsetPagination({ page, limit }),
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

  async addReview(id: number, payload: AddReviewPayload): Promise<number> {
    const review = await prisma.review.create({
      data: { carId: id, ...payload },
      include: { user: { select: { name: true, lastname: true, avatar: true } } },
    });

    return review.id;
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
