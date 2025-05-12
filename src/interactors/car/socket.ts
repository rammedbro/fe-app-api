import { io } from '@/server';
import type { Namespace } from 'socket.io';
import type { CarSocketEmitEvents, CarSocketListenEvents } from './model';

export class CarSocket {
  private static io: Namespace<CarSocketListenEvents, CarSocketEmitEvents>;
  private room: string;

  constructor(carId: number) {
    this.room = carId.toString();
  }

  static connect() {
    CarSocket.io = io.of('/cars');
    CarSocket.io.on('connection', (socket) => {
      const { carId } = socket.handshake.query;

      if (carId) {
        socket.join(carId);
      }
    });
  }

  emit<Event extends keyof CarSocketEmitEvents>(event: Event, ...args: Parameters<CarSocketEmitEvents[Event]>) {
    CarSocket.io.to(this.room).emit(event, ...args);
  }
}
