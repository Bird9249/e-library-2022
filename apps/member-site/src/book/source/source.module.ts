import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [SourceService, PrismaService],
  controllers: [SourceController],
})
export class SourceModule {}
