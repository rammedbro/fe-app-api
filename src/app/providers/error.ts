import { RouteValidationError, SchemaValidationError, UniquenessConstraintError } from '@/entities/error';
import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { ValidateError } from 'tsoa';
import { ZodError } from 'zod';

export const error = (err: unknown, _: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).send(err.message);
  }

  if (err instanceof ValidateError) {
    return res.status(400).json(new RouteValidationError(err.fields));
  }

  if (err instanceof ZodError) {
    return res.status(422).json(new SchemaValidationError(err.flatten().fieldErrors));
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json(new UniquenessConstraintError(err.meta?.target as string[]));
    }

    if (err.code === 'P2025') {
      return res.status(404).send('Not Found');
    }
  }

  if (err instanceof Error) {
    console.error(err.stack);
    return res.status(500).send('Internal Server Error');
  }

  next();
};
