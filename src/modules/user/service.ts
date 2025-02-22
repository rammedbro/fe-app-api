import { db } from '@/db';
import type { Car } from '@/modules/cars/model';
import { AddUserValidationSchema } from './validation';
import { AbstractService } from '@/service';
import type { PaginatedList } from '@/types';
import argon from 'argon2';
import type {
  User,
  Notification,
  Order,
  Favorite,
  GetFavoriteListOptions,
  GetOrderListOptions,
  AddUserPayload,
  AddFavoritePayload,
  GetNotificationListOptions,
  UpdateNotificationPayload,
  AddOrderPayload,
  UpdateNotificationOptions,
} from './model';

export class UsersService extends AbstractService {
  getUser(id: number): Promise<User | null> {
    return db.user.findUnique({
      where: { id },
    });
  }

  async addUser(payload: AddUserPayload): Promise<User> {
    AddUserValidationSchema.parse(payload);
    return db.user.create({
      data: {
        ...payload,
        password: await argon.hash(payload.password),
      },
    });
  }

  async getFavoriteList(id: number, options: Partial<GetFavoriteListOptions> = {}): Promise<PaginatedList<Car>> {
    const { page = 1, limit = UsersService.PAGINATION_LIMIT, sortDir = UsersService.SORT_DIRECTION } = options;
    const favorites = await db.favorite.findMany({
      where: { userId: id },
      select: {
        car: true,
      },
      skip: UsersService.toOffsetPagination({ page, limit }),
      take: limit,
    });
    const count = await db.favorite.count({
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
    return db.favorite.create({
      data: { userId: id, ...payload },
    });
  }

  async getNotificationList(
    id: number,
    options: Partial<GetNotificationListOptions> = {}
  ): Promise<PaginatedList<Notification>> {
    const { page = 1, limit = UsersService.PAGINATION_LIMIT, sortDir = UsersService.SORT_DIRECTION } = options;
    const { notifications, _count } = await db.user.findUniqueOrThrow({
      where: { id },
      select: {
        notifications: {
          skip: UsersService.toOffsetPagination({ page, limit }),
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
    await db.notification.updateMany({
      where: {
        id: { in: options.id },
        userId: id,
      },
      data: payload,
    });
  }

  async getOrderList(id: number, options: Partial<GetOrderListOptions> = {}): Promise<PaginatedList<Order>> {
    const { page = 1, limit = UsersService.PAGINATION_LIMIT, sortDir = UsersService.SORT_DIRECTION } = options;
    const { orders, _count } = await db.user.findUniqueOrThrow({
      where: { id },
      select: {
        orders: {
          include: { car: true },
          skip: UsersService.toOffsetPagination({ page, limit }),
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

  async addOrder(id: number, payload: AddOrderPayload): Promise<Order> {
    const { orders } = await db.user.update({
      where: { id },
      data: {
        orders: {
          create: payload,
        },
      },
      select: {
        orders: {
          include: { car: true },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return orders.pop() as Order;
  }
}
