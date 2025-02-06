import type { PaginationOptions, SortOptions } from '@/types';
import type { Car } from '@/modules/cars/model';
import type { FavoriteDBModel, NotificationDBModel, OrderDBModel, UserDBModel } from '@/types/models.gen';
import type { Prisma } from '.prisma/client';

export interface User extends UserDBModel {}

export interface GetUserListOptions extends PaginationOptions, SortOptions {}

export type AddUserPayload = {
  [K in Exclude<keyof User, 'id' | 'createdAt'>]: User[K];
};

export interface UpdateUserPayload extends AddUserPayload {}

export interface Notification extends NotificationDBModel {}

export interface GetNotificationListOptions extends PaginationOptions, SortOptions {}

export type UpdateNotificationPayload = {
  [K in Extract<keyof Notification, 'isSeen'>]: Notification[K];
};

export interface UpdateNotificationOptions {
  id: number[];
}

export interface Favorite extends FavoriteDBModel {}

export interface GetFavoriteListOptions extends PaginationOptions, SortOptions {}

export type AddFavoritePayload = {
  [K in Extract<keyof Favorite, 'carId'>]: Favorite[K];
};

export interface Order extends OrderDBModel {
  car: Car;
}

export interface GetOrderListOptions extends PaginationOptions, SortOptions {}

export type AddOrderPayload = {
  [K in Exclude<keyof OrderDBModel, 'id' | 'createdAt' | 'userId'>]: OrderDBModel[K];
} & {
  [K in Extract<keyof OrderDBModel, 'pickup' | 'dropoff' | 'payment'>]:
    | Prisma.JsonNullValueInput
    | Prisma.InputJsonValue;
};
