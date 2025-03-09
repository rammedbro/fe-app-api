import type * as order from '@/entities/order';

declare global {
  namespace PrismaJson {
    type OrderPickup = order.OrderPickup;
    type OrderDropoff = order.OrderDropoff;
    type OrderPayment = order.OrderPayment;
  }
}

export {};
