import type { ReviewDBModel } from '@/repositories/prisma/models';
import type { User } from '@/entities/user';

export interface Review extends ReviewDBModel {
  user: User;
}
