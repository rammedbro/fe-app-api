import type { Car } from '@/entities/car';
import type { LocationPoint } from '@/entities/location';
import type { CreditCardPayment, PaypalPayment, BitcoinPayment } from '@/entities/payment';
import type { OrderDBModel } from '@/repositories/prisma/models';
import type { JSONCompatible } from '@/shared/models/json';

export type OrderPickup = {
  location: LocationPoint;
  date: string;
};

export interface OrderDropoff {
  location: LocationPoint;
  date: string;
}

export type OrderPayment = CreditCardPayment | PaypalPayment | BitcoinPayment;

export interface Order extends OrderDBModel {
  car: Car;
  pickup: JSONCompatible<OrderPickup>;
  dropoff: JSONCompatible<OrderDropoff>;
  payment: JSONCompatible<OrderPayment>;
}
