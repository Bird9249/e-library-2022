import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HelperModule } from '../common/helper/helper.module';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { AdvertisingConsumer } from './advertising.consumer';
import { AdvertisingController } from './advertising.controller';
import { AdvertisingService } from './advertising.service';
import { ValidationService } from './validation.service';

@Module({
  imports: [
    UploadFileModule,
    BullModule.registerQueue({
      name: 'book-ad',
    }),
    HelperModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AdvertisingController],
  providers: [
    AdvertisingService,
    PrismaService,
    ValidationService,
    AdvertisingConsumer,
  ],
})
export class AdvertisingModule {}
