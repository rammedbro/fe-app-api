import type { ReviewDBModel } from '@/shared/models';
import type { User } from '@/entities/user';

export interface Review extends ReviewDBModel {
  user: User;
}
