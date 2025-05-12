import { socketAuthentication } from '@/app/providers/auth';
import { io } from '@/server';
import type { Namespace } from 'socket.io';
import type { UserSocketEmitEvents, UserSocketListenEvents } from './model';

export class UserSocket {
  private static io: Namespace<UserSocketListenEvents, UserSocketEmitEvents>;
  private room: string;

  constructor(userId: number) {
    this.room = userId.toString();
  }

  static connect() {
    UserSocket.io = io.of('/user');
    UserSocket.io.use(socketAuthentication('cookie'));
    UserSocket.io.on('connection', () => {});
  }

  emit<Event extends keyof UserSocketEmitEvents>(event: Event, ...args: Parameters<UserSocketEmitEvents[Event]>) {
    UserSocket.io.to(this.room).emit(event, ...args);
  }
}
