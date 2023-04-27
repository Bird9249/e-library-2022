import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileModule } from '../../upload-file/upload-file.module';
import { HelperService } from '../common/helper/helper.service';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [EventEmitterModule.forRoot(), UploadFileModule],
  controllers: [BooksController],
  providers: [BooksService, HelperService, PrismaService],
  exports: [BooksService],
})
export class BooksModule {}
