import type { User } from '@/entities/user';
import type { ReviewDBModel } from '@/repositories/prisma/models';

export { ReviewDBModel };

export interface Review extends ReviewDBModel {
  user: Pick<User, 'name' | 'lastname' | 'avatar'>;
}
