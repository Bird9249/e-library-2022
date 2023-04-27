import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HelperModule } from '../../common/helper/helper.module';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileModule } from '../../upload-file/upload-file.module';
import { BookExtenSionValidationService } from './book-extension-validation.service';
import { BookExtensionController } from './book-extension.controller';
import { BookExtensionService } from './book-extension.service';

@Module({
  imports: [UploadFileModule, HelperModule, EventEmitterModule.forRoot()],
  controllers: [BookExtensionController],
  providers: [
    BookExtensionService,
    PrismaService,
    BookExtenSionValidationService,
  ],
})
export class BookExtensionModule {}
