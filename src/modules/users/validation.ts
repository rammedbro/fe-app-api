import { z } from 'zod';
import owasp from 'owasp-password-strength-test';

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
