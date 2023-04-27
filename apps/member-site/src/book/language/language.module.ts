import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [LanguageService, PrismaService],
  controllers: [LanguageController],
})
export class LanguageModule {}
