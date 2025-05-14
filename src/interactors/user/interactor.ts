import type { CarType } from '@/entities/car';
import type { Favorite } from '@/entities/favorite';
import type { Notification } from '@/entities/notification';
import type { Order } from '@/entities/order';
import type { PaginatedList } from '@/entities/pagination';
import type { Review } from '@/entities/review';
import { AbstractInteractor } from '@/interactors/abstract';
import { CarSocket } from '@/interactors/car/socket';
import { prisma } from '@/repositories/prisma/client';
import argon from 'argon2';
import type {
  AddOrderPayload,
  AddReviewPayload,
  AddUserPayload,
  BulkFavoritePayload,
  GetFavoriteListOptions,
  GetNotificationListOptions,
  GetOrderAggregationOptions,
  GetOrderListOptions,
  GetReviewListOptions,
  GetUserReturn,
} from './model';
import { UserSocket } from './socket';
import { AddOrderValidationSchema, AddReviewValidationSchema, AddUserValidationSchema } from './validation';

export class UserInteractor extends AbstractInteractor {
  getUser(id: number): Promise<GetUserReturn> {
    return prisma.user.findUniqueOrThrow({
      where: { id },
      include: { notifications: true },
    });
  }

  async addUser(payload: AddUserPayload): Promise<number> {
    AddUserValidationSchema.parse(payload);

    const user = await prisma.user.create({
      data: {
        ...payload,
        password: await argon.hash(payload.password),
      },
      select: { id: true },
    });

    prisma.notification
      .create({
        data: { userId: user.id, type: 'UserCreated', meta: { name: payload.name } },
      })
      .then((notification) => new UserSocket(user.id).emit('addNotification', notification));

    return user.id;
  }

  async getFavoriteList(
    userId: number,
    options: Partial<GetFavoriteListOptions> = {}
  ): Promise<PaginatedList<Favorite>> {
    const { page = 1, limit = UserInteractor.PAGINATION_LIMIT, sortDir = UserInteractor.SORT_DIRECTION } = options;
    const items = await prisma.favorite.findMany({
      where: { userId },
      include: { car: true },
      skip: UserInteractor.toOffsetPagination(page, limit),
      take: limit,
      orderBy: options.sortBy?.map((field) => ({ [field]: sortDir })),
    });
    const count = await prisma.favorite.count({
      where: { userId },
    });

    return {
      items,
      page,
      limit,
      count,
    };
  }

  async bulkFavorite(userId: number, payload: BulkFavoritePayload) {
    const transactions = [];

    if (payload.add?.length) {
      const promise = prisma.favorite.createManyAndReturn({
        data: payload.add.map((carId) => ({ userId, carId })),
      });

      transactions.push(promise);
    }

    if (payload.del?.length) {
      const promise = prisma.favorite.deleteMany({
        where: {
          userId,
          carId: { in: payload.del },
        },
      });

      transactions.push(promise);
    }

    if (transactions.length) {
      await prisma.$transaction(transactions);
    }
  }

  async getNotificationList(
    id: number,
    options: Partial<GetNotificationListOptions> = {}
  ): Promise<PaginatedList<Notification>> {
    const { page = 1, limit = UserInteractor.PAGINATION_LIMIT, sortDir = UserInteractor.SORT_DIRECTION } = options;
    const { notifications, _count } = await prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        notifications: {
          skip: UserInteractor.toOffsetPagination(page, limit),
          take: limit,
          orderBy: options.sortBy?.map((field) => ({ [field]: sortDir })),
        },
        _count: {
          select: { notifications: true },
        },
      },
    });

    return { items: notifications, page, limit, count: _count.notifications };
  }

  async getOrderList(userId: number, options: Partial<GetOrderListOptions> = {}): Promise<PaginatedList<Order>> {
    const { page = 1, limit = UserInteractor.PAGINATION_LIMIT, sortDir = UserInteractor.SORT_DIRECTION } = options;
    const { orders, _count } = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        orders: {
          include: { car: true },
          skip: UserInteractor.toOffsetPagination(page, limit),
          take: limit,
          orderBy: options.sortBy?.map((field) => ({ [field]: sortDir })),
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return { items: orders, page, limit, count: _count.orders };
  }

  async addOrder(userId: number, payload: AddOrderPayload): Promise<number> {
    AddOrderValidationSchema.parse(payload);

    const order = await prisma.order.create({
      data: { userId, ...payload },
      select: { id: true },
    });

    prisma.notification
      .create({
        data: { userId, type: 'OrderCreated', meta: { orderId: order.id } },
      })
      .then((notification) => new UserSocket(userId).emit('addNotification', notification));

    return order.id;
  }

  async getOrder(orderId: number): Promise<Order> {
    return prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { car: true },
    });
  }

  async getCurrentOrder(userId: number): Promise<Order> {
    return prisma.order.findFirstOrThrow({
      where: {
        userId,
        dropoff: {
          path: ['date'],
          gt: new Date().toISOString(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: { car: true },
    });
  }

  async getOrderAggregation(userId: number, payload: GetOrderAggregationOptions) {
    switch (payload.groupBy) {
      case 'type':
        return prisma.$queryRaw<{ type: CarType; _count: number }[]>`
          SELECT c.type, COUNT(o.id)::int as _count
          FROM "Order" o
          JOIN "Car" c ON o."carId" = c.id
          WHERE o."userId" = ${userId}
          GROUP BY c.type
          ORDER BY _count DESC;
        `;
      case 'brand':
        return prisma.$queryRaw<{ brand: string; _count: number }[]>`
          SELECT c.brand, COUNT(o.id)::int as _count
          FROM "Order" o
          JOIN "Car" c ON o."carId" = c.id
          WHERE o."userId" = ${userId}
          GROUP BY c.brand
          ORDER BY _count DESC;
      `;
    }
  }

  async addReview(userId: number, payload: AddReviewPayload): Promise<number> {
    AddReviewValidationSchema.parse(payload);

    const review = await prisma.review.create({
      data: { userId, ...payload },
      include: { user: { select: { name: true, lastname: true, avatar: true } } },
    });

    new CarSocket(payload.carId).emit('addReview', review);

    return review.id;
  }

  async getReviewList(userId: number, options: GetReviewListOptions = {}): Promise<PaginatedList<Review>> {
    const { page = 1, limit = UserInteractor.PAGINATION_LIMIT, sortDir = UserInteractor.SORT_DIRECTION } = options;
    const { reviews, _count } = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        reviews: {
          where: {
            title: { equals: options.title },
            carId: { equals: options.carId },
          },
          include: { user: { select: { name: true, lastname: true, avatar: true } } },
          skip: UserInteractor.toOffsetPagination(page, limit),
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
}
