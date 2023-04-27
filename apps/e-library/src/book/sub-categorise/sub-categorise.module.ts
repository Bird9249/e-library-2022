import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoriseModule } from '../categorise/categorise.module';
import { HelperService } from '../common/helper/helper.service';
import { SubCategoriseController } from './sub-categorise.controller';
import { SubCategoriseService } from './sub-categorise.service';

@Module({
  imports: [CategoriseModule],
  controllers: [SubCategoriseController],
  providers: [SubCategoriseService, PrismaService, HelperService],
})
export class SubCategoriseModule {}
