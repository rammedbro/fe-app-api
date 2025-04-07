import type { Favorite } from '@/entities/favorite';
import type { Notification } from '@/entities/notification';
import type { Order } from '@/entities/order';
import type { PaginationOptions } from '@/entities/pagination';
import type { SortOptions } from '@/entities/sort';
import type { User } from '@/entities/user';

export type AddUserPayload = {
  [K in Exclude<keyof User, 'id' | 'createdAt' | 'favorites'>]: User[K];
};

export interface GetUserReturn extends User {
  favorites: Favorite[];
  notifications: Notification[];
}

export interface GetNotificationListOptions extends PaginationOptions, SortOptions {}

export interface GetFavoriteListOptions extends PaginationOptions, SortOptions {}

export interface AddFavoritePayload {
  carId: number;
}

export interface DelFavoritePayload {
  carId: number;
}

export interface GetOrderListOptions extends PaginationOptions, SortOptions {}

export type AddOrderPayload = {
  [K in Exclude<keyof Order, 'id' | 'createdAt' | 'userId' | 'car'>]: Order[K];
};
