import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

@Module({
  controllers: [PublisherController],
  providers: [PublisherService, PrismaService],
})
export class PublisherModule {}
