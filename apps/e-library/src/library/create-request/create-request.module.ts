import { Module } from '@nestjs/common';
import { CreateRequestService } from './create-request.service';
import { CreateRequestController } from './create-request.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileModule } from '../../upload-file/upload-file.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [UploadFileModule, EventEmitterModule.forRoot()],
  controllers: [CreateRequestController],
  providers: [CreateRequestService, PrismaService],
  exports: [CreateRequestService],
})
export class CreateRequestModule {}
