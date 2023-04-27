import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookAdController } from './book-ad.controller';
import { BookAdService } from './book-ad.service';

@Module({
  controllers: [BookAdController],
  providers: [BookAdService, PrismaService],
  exports: [BookAdService],
})
export class BookAdModule {}
