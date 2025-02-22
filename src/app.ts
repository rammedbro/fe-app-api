import process from 'node:process';
import { db } from '@/db';
import express, { json, Request, Response, urlencoded } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import fs from 'node:fs/promises';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import argon from 'argon2';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { ValidateError } from 'tsoa';
import { ZodError } from 'zod';
import { RegisterRoutes } from './routes';
import { RouteValidationError, SchemaValidationError, UniquenessConstraintError } from './types';
import { Prisma } from '@prisma/client';

const app = express();

// Middlewares
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    rolling: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENV === 'production',
      sameSite: process.env.ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      path: '/',
      maxAge: 30 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    exposedHeaders: ['x-page', 'x-prev-page', 'x-next-page', 'x-per-page', 'x-total-count'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(urlencoded({ extended: true }));
app.use(json());

passport.use(
  new Strategy(async (username, password, done) => {
    const user = await db.user.findUnique({
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
  })
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user as Express.User));

// Routes
RegisterRoutes(app);
app.use('/docs', swaggerUi.serve, async (req: Request, res: Response) => {
  const json = JSON.parse(await fs.readFile('./build/swagger.json', 'utf-8'));

  if (req.query.json) {
    res.send(json);
    return;
  }

  res.send(swaggerUi.generateHTML(json));
});
app.use((_: Request, res: Response) => {
  res.status(404).send('Not Found');
});

// Error handling
app.use((err: unknown, _: Request, res: Response, next: () => void) => {
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
  }

  if (err instanceof Error) {
    console.error(err.stack);
    return res.status(500).send('Internal Server Error');
  }

  next();
});

export { app };
