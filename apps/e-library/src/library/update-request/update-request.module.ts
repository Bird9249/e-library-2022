import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateRequestController } from './update-request.controller';
import { UpdateRequestService } from './update-request.service';

@Module({
  controllers: [UpdateRequestController],
  providers: [UpdateRequestService, PrismaService],
  exports: [UpdateRequestService],
})
export class UpdateRequestModule {}
