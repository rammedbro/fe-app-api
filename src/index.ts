import { passport } from '@/app/providers/passport';
import { router } from '@/app/providers/router';
import { prisma } from '@/repositories/prisma';
import { redis } from '@/repositories/redis';
import argon from 'argon2';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createApp } from '@/app/ui/app';
import process from 'node:process';
import { json, Request, Response, urlencoded } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import cors from 'cors';
import { ValidateError } from 'tsoa';
import { ZodError } from 'zod';
import { RouteValidationError, SchemaValidationError, UniquenessConstraintError } from '@/entities/error';
import { Prisma } from '@prisma/client';
import { Strategy } from 'passport-local';

const app = createApp()
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(
    cors({
      origin: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      exposedHeaders: ['x-page', 'x-prev-page', 'x-next-page', 'x-per-page', 'x-total-count'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 24 * 60 * 60 * 1000,
    })
  )
  .use(
    session({
      name: 'sid',
      secret: process.env.SESSION_SECRET as string,
      store: new RedisStore({ client: redis, prefix: 'sid:' }),
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 1000,
      },
    })
  )
  .plugin(passport, {
    strategy: new Strategy(async (username, password, done) => {
      const user = await prisma.user.findUnique({
        where: { email: username },
      });

      if (!user || !(await argon.verify(user.password, password))) {
        return done(createHttpError(401, 'Incorrect login or password'), false);
      }

      const { id, email, name, lastname, avatar } = user;
      return done(null, {
        id,
        email,
        name,
        lastname,
        avatar,
      });
    }),
  })
  .plugin(router, undefined)
  .use((err: unknown, _: Request, res: Response, next: () => void) => {
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
  });

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT) || 4000;

app.listen(port, host, () => {
  console.log(`Server listen on http://${host}:${port}`);
});
