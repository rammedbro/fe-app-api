import { db } from '@/db';
import type { User, UserCreateData } from './model';

export class UsersService {
  get(id: number): Promise<User | null> {
    return db.user.findUnique({
      where: { id },
    });
  }

  getPaginated(page: number, limit: number): Promise<User[]> {
    return db.user.findMany({
      skip: (page > 1 ? page - 1 : 0) * limit,
      take: limit,
    });
  }

  async getTotalCount() {
    return db.user.count();
  }

  create(data: UserCreateData): Promise<User> {
    return db.user.create({
      data,
    });
  }
}
