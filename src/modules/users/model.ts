import type { User } from '@/types/models.gen';

/**
 * All fields of user object stored in database
 */
export type { User };
/**
 * Fields of user object that you allowed to set while creating one
 */
export type UserCreateData = {
  [K in Exclude<keyof User, 'id' | 'createdAt'>]: User[K];
};
