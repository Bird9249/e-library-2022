import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Library } from '@prisma/client';
import { io } from 'socket.io-client';

@Injectable()
export class LibrarySocketService {
  constructor(private readonly eventEmiiter: EventEmitter2) {
    this.socket.on('confrimCreateLibrary', (data) => {
      this.confirmCreate(data);
    });

    this.socket.on('confrimUpdateLibrary', (data) => {
      this.confirmUpdate(data);
    });
  }

  private socket = io('ws://localhost:3003');

  createLib(body: Library) {
    this.socket.emit('createLibrary', body);
  }

  upgradeStorage(body: any) {
    this.socket.emit('updateLibraryStorage', body);
  }

  confirmCreate(data: any) {
    this.eventEmiiter.emit(`confirm-create-library`, data);
  }

  confirmUpdate(data: any) {
    this.eventEmiiter.emit(`confirm-update-library`, data);
  }
}
