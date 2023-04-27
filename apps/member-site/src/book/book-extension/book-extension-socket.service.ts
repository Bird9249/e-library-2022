import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { io } from 'socket.io-client';

@Injectable()
export class BookExtensionSocketService {
  constructor(private readonly eventEmiiter: EventEmitter2) {
    this.socket.on('adminActionBook', (data) => {
      this.eventEmiiter.emit(`admin-action-book`, data);
    });
  }

  private socket = io('ws://localhost:3003');

  memberPublicedBook(body: any) {
    this.socket.emit('memberPublicedBook', body);
  }
}
