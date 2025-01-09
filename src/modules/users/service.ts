import { getXataClient } from '@/xata';
import type { User, UserCreationParams } from './model';

export class UsersService {
  xata = getXataClient();

  get(id: string): Promise<User | null> {
    return this.xata.db.users.read(id);
  }

  getPaginated(page: number, limit: number) {
    return this.xata.db.users.getPaginated({
      pagination: {
        offset: page * limit,
        size: limit,
      },
    });
  }

  async getTotalCount() {
    const res = await this.xata.db.users
      .aggregate({
        totalCount: {
          count: '*',
        },
      });

    return res.aggs.totalCount;
  }

  create(params: UserCreationParams): Promise<User> {
    return this.xata.db.users.create(params);
  }
}
