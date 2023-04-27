import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdvertisingModule } from './advertising/advertising.module';
import { AuthModule } from './auth/auth.module';
import { AudioImportModule } from './book/audio/audio-import/audio-import.module';
import { AudioModule } from './book/audio/audio/audio.module';
import { AuthorsModule } from './book/authors/authors.module';
import { BookExtensionModule } from './book/book-extension/book-extension.module';
import { BookModule } from './book/book/book/book.module';
import { EBookImportModule } from './book/e-book/e-book-import/e-book-import.module';
import { EBookModule } from './book/e-book/e-book/e-book.module';
import { LanguageModule } from './book/language/language.module';
import { PublisherModule } from './book/publisher/publisher.module';
import { SourceModule } from './book/source/source.module';
import { VideoImportModule } from './book/video/video-import/video-import.module';
import { VideoModule } from './book/video/video/video.module';
import { LibraryModule } from './library/library.module';
import { MailModule } from './mail/mail.module';
import { MemberSiteController } from './member-site.controller';
import { MemberSiteService } from './member-site.service';
import { PrismaService } from './prisma/prisma.service';
import { RoleModule } from './role/role.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public'),
    }),
    AuthModule,
    UsersModule,
    AuthorsModule,
    UploadFileModule,
    LibraryModule,
    AdvertisingModule,
    BookModule,
    EBookImportModule,
    BookExtensionModule,
    EBookModule,
    VideoModule,
    VideoImportModule,
    AudioModule,
    AudioImportModule,
    SourceModule,
    LanguageModule,
    PublisherModule,
    MailModule,
    RoleModule,
  ],
  controllers: [MemberSiteController],
  providers: [MemberSiteService, PrismaService],
})
export class MemberSiteModule {}
