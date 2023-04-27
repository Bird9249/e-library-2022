import { Module } from '@nestjs/common';
import { CategoriseService } from './categorise.service';
import { CategoriseController } from './categorise.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { HelperService } from '../common/helper/helper.service';

@Module({
  controllers: [CategoriseController],
  providers: [CategoriseService, PrismaService, HelperService],
  exports: [CategoriseService],
})
export class CategoriseModule {}
