import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';

@Module({
  controllers: [SourceController],
  providers: [SourceService, PrismaService],
})
export class SourceModule {}
