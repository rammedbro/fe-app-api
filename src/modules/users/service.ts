import { getXataClient } from '@/xata';
import type { User } from './model';

export class UsersService {
  xata = getXataClient();

  get(id: string): Promise<User | null> {
    return this.xata.db.users.read(id);
  }

  create(params: Omit<User, 'id'>): Promise<User> {
    return this.xata.db.users.create(params);
  }
}
