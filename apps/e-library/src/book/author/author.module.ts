import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HelperService } from '../common/helper/helper.service';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService, HelperService, PrismaService],
})
export class AuthorModule {}
