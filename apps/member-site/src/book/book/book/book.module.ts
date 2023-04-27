import { Module } from '@nestjs/common';
import { HelperModule } from '../../common/helper/helper.module';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileModule } from '../../upload-file/upload-file.module';
import { BookExtenSionValidationService } from './book-extension-validation.service';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [UploadFileModule, HelperModule],
  controllers: [BookController],
  providers: [BookService, PrismaService, BookExtenSionValidationService],
})
export class BookExtensionModule {}
