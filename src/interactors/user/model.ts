import type { Favorite } from '@/entities/favorite';
import type { Notification } from '@/entities/notification';
import type { Order } from '@/entities/order';
import type { PaginationOptions } from '@/entities/pagination';
import type { SortOptions } from '@/entities/sort';
import type { User } from '@/entities/user';
import type { Prisma } from '.prisma/client';

export type AddUserPayload = {
  [K in Exclude<keyof User, 'id' | 'createdAt'>]: User[K];
};

export interface GetNotificationListOptions extends PaginationOptions, SortOptions {}

export type UpdateNotificationPayload = {
  [K in Extract<keyof Notification, 'isSeen'>]: Notification[K];
};

export interface UpdateNotificationOptions {
  id: number[];
}

export interface GetFavoriteListOptions extends PaginationOptions, SortOptions {}

export type AddFavoritePayload = {
  [K in Extract<keyof Favorite, 'carId'>]: Favorite[K];
};

export interface GetOrderListOptions extends PaginationOptions, SortOptions {}

export type AddOrderPayload = {
  [K in Exclude<keyof Order, 'id' | 'createdAt' | 'userId' | 'car'>]: Order[K];
} & {
  [K in Extract<keyof Order, 'pickup' | 'dropoff' | 'payment'>]: Prisma.JsonNullValueInput | Prisma.InputJsonValue;
};
