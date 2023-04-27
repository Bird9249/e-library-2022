import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { io } from 'socket.io-client';

@Injectable()
export class AdvertisingSocketService {
  constructor(private readonly eventEmiiter: EventEmitter2) {
    this.socket.on('confirmCreateAd', (data) => {
      this.confirmCreate(data);
    });
  }

  private socket = io('ws://localhost:3003');

  createAd(body: any) {
    this.socket.emit('createAd', body);
  }

  private confirmCreate(data: any) {
    this.eventEmiiter.emit(`confirm-create-ad`, data);
  }
}
