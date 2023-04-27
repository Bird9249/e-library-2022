import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileModule } from '../../upload-file/upload-file.module';
import { SupportAdConsumer } from './support-ad.consumer';
import { SupportAdController } from './support-ad.controller';
import { SupportAdService } from './support-ad.service';

@Module({
  imports: [
    UploadFileModule,
    BullModule.registerQueue({
      name: 'support-ad',
    }),
  ],
  controllers: [SupportAdController],
  providers: [SupportAdService, PrismaService, SupportAdConsumer],
})
export class SupportAdModule {}
