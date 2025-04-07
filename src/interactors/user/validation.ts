import owasp from 'owasp-password-strength-test';
import { z } from 'zod';

export const AddUserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().superRefine((value, ctx) => {
    const { errors } = owasp.test(value);

    errors.forEach((err) =>
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: err,
      })
    );
  }),
});

const LocationPoint = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const AddOrderValidationSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  pickup: z.object({
    location: LocationPoint,
    date: z.string().datetime(),
  }),
  dropoff: z.object({
    location: LocationPoint,
    date: z.string().datetime(),
  }),
  payment: z.discriminatedUnion('method', [
    z.object({
      method: z.literal('credit-card'),
      data: z.object({
        number: z.string().length(16),
        expires: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/),
        cvc: z.string().length(3),
      }),
    }),
    z.object({
      method: z.literal('paypal'),
    }),
    z.object({
      method: z.literal('bitcoin'),
    }),
  ]),
});
