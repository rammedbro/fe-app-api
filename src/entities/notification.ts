import type { NotificationDBModel, NotificationType } from '@/repositories/prisma/models';

export type { NotificationType };

export type Notification = Omit<NotificationDBModel, 'meta'> &
  ({ type: 'UserCreated'; meta: { name: string } } | { type: 'OrderCreated'; meta: { orderId: number } });
