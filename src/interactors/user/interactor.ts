import type { Car } from '@/entities/car';
import type { Favorite } from '@/entities/favorite';
import type { Notification } from '@/entities/notification';
import type { Order } from '@/entities/order';
import type { PaginatedList } from '@/entities/pagination';
import { AbstractInteractor } from '@/interactors/abstract';
import { prisma } from '@/repositories/prisma/client';
import argon from 'argon2';
import type {
  AddFavoritePayload,
  AddOrderPayload,
  AddUserPayload,
  DelFavoritePayload,
  GetFavoriteListOptions,
  GetNotificationListOptions,
  GetOrderListOptions,
  GetUserReturn,
} from './model';
import { AddOrderValidationSchema, AddUserValidationSchema } from './validation';

export class UserInteractor extends AbstractInteractor {
  getUser(id: number): Promise<GetUserReturn> {
    return prisma.user.findUniqueOrThrow({
      where: { id },
      include: { favorites: true, notifications: true },
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

    return user.id;
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
      data: { userId: id, carId: payload.carId },
    });
  }

  async delFavorite(id: number, payload: DelFavoritePayload): Promise<void> {
    await prisma.favorite.delete({
      where: { id: { userId: id, carId: payload.carId } },
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
