import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [UploadFileModule, EventEmitterModule.forRoot()],
  controllers: [LibraryController],
  providers: [LibraryService, PrismaService],
})
export class LibraryModule {}
