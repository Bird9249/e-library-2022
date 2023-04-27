import { Module } from '@nestjs/common';
import { AudioImportService } from './audio-import.service';
import { AudioImportController } from './audio-import.controller';
import { UploadFileModule } from 'apps/member-site/src/upload-file/upload-file.module';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HelperModule } from 'apps/member-site/src/common/helper/helper.module';
import { PrismaService } from 'apps/member-site/src/prisma/prisma.service';
import { bookValidationServiceProvider } from '../../book-validation/book-validation';
import { AudioConsumer } from './audio.import.consumer';

@Module({
  imports: [
    UploadFileModule,
    BullModule.registerQueue({
      name: 'audio',
    }),
    EventEmitterModule.forRoot(),
    HelperModule,
  ],
  controllers: [AudioImportController],
  providers: [
    AudioImportService,
    PrismaService,
    bookValidationServiceProvider,
    AudioConsumer,
  ],
})
export class AudioImportModule {}
