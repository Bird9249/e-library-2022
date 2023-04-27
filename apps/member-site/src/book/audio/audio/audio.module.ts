import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { UploadFileModule } from 'apps/member-site/src/upload-file/upload-file.module';
import { HelperModule } from 'apps/member-site/src/common/helper/helper.module';
import { PrismaService } from 'apps/member-site/src/prisma/prisma.service';
import { ValidationService } from 'apps/member-site/src/common/validation.service';

@Module({
  imports: [UploadFileModule, HelperModule],
  controllers: [AudioController],
  providers: [AudioService, PrismaService, ValidationService],
})
export class AudioModule {}
