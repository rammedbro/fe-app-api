import argon from 'argon2';
import { prisma } from '@/repositories/prisma/client';
import { AddOrderValidationSchema, AddUserValidationSchema } from './validation';
import { AbstractInteractor } from '@/interactors/abstract';
import type { PaginatedList } from '@/entities/pagination';
import type { Car } from '@/entities/car';
import type { Favorite } from '@/entities/favorite';
import type { Notification } from '@/entities/notification';
import type { Order } from '@/entities/order';
import type { User } from '@/entities/user';
import type {
  GetFavoriteListOptions,
  GetOrderListOptions,
  AddUserPayload,
  AddFavoritePayload,
  GetNotificationListOptions,
  UpdateNotificationPayload,
  AddOrderPayload,
  UpdateNotificationOptions,
} from './model';

export class UserInteractor extends AbstractInteractor {
  getUser(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async addUser(payload: AddUserPayload): Promise<User> {
    AddUserValidationSchema.parse(payload);

    return prisma.user.create({
      data: {
        ...payload,
        password: await argon.hash(payload.password),
      },
    });
  }

  async getFavoriteList(id: number, options: Partial<GetFavoriteListOptions> = {}): Promise<PaginatedList<Car>> {
    const { page = 1, limit = UserInteractor.PAGINATION_LIMIT, sortDir = UserInteractor.SORT_DIRECTION } = options;
    const favorites = await prisma.favorite.findMany({
      where: { userId: id },
      select: {
        car: true,
      },
      skip: UserInteractor.toOffsetPagination({ page, limit }),
      take: limit,
    });
    const count = await prisma.favorite.count({
      where: { userId: id },
    });

    return {
      items: favorites.map((item) => item.car),
      page,
      limit,
      count,
    };
  }

  addFavorite(id: number, payload: AddFavoritePayload): Promise<Favorite> {
    return prisma.favorite.create({
      data: { userId: id, ...payload },
    });
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
          skip: UserInteractor.toOffsetPagination({ page, limit }),
          take: limit,
        },
        _count: {
          select: { notifications: true },
        },
      },
    });

    return { items: notifications, page, limit, count: _count.notifications };
  }

  async updateNotification(
    id: number,
    payload: UpdateNotificationPayload,
    options: Partial<UpdateNotificationOptions> = {}
  ): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        id: { in: options.id },
        userId: id,
      },
      data: payload,
    });
  }

  async getOrderList(id: number, options: Partial<GetOrderListOptions> = {}): Promise<PaginatedList<Order>> {
    const { page = 1, limit = UserInteractor.PAGINATION_LIMIT, sortDir = UserInteractor.SORT_DIRECTION } = options;
    const { orders, _count } = await prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        orders: {
          include: { car: true },
          skip: UserInteractor.toOffsetPagination({ page, limit }),
          take: limit,
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

    return order.id;
  }

  async getOrder(orderId: number): Promise<Order> {
    return prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { car: true },
    });
  }
}
