import { createServer } from 'node:http';
import process from 'node:process';
import passport from 'passport';
import { Server } from 'socket.io';
import { app } from './app';
import { cors } from './app/providers/cors';
import { session } from './app/providers/session';
import { CarSocket } from './interactors/car';
import { UserSocket } from './interactors/user';

export const server = createServer(app);
export const io = new Server(server, { path: process.env.SOCKET_PATH });

io.engine.use(cors);
io.engine.use(session);
io.engine.use(passport.initialize());
io.engine.use(passport.session());

UserSocket.connect();
CarSocket.connect();
