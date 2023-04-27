import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HelperService } from './helper.service';

@Module({
  providers: [HelperService, PrismaService],
  exports: [HelperService],
})
export class HelperModule {}
