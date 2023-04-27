import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { HelperService } from './common/helper/helper.service';
import { PrismaService } from './prisma/prisma.service';
import { BooksPageModule as PrivateBooksPageModule } from './private-library/books-page/books-page.module';
import { HomePageModule as PrivateHomePageModule } from './private-library/home-page/home-page.module';
import { LibraryModule } from './private-library/library/library.module';
import { BooksPageModule } from './public-library/books-page/books-page.module';
import { DetailPageModule } from './public-library/detail-page/detail-page.module';
import { HomePageModule } from './public-library/home-page/home-page.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { UsersModule } from './users/users.module';
import { ViewerSiteController } from './viewer-site.controller';
import { ViewerSiteService } from './viewer-site.service';

@Module({
  imports: [
    HomePageModule,
    BooksPageModule,
    DetailPageModule,
    AuthModule,
    UsersModule,
    LibraryModule,
    UploadFileModule,
    PrivateHomePageModule,
    PrivateBooksPageModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [ViewerSiteController],
  providers: [ViewerSiteService, PrismaService, HelperService],
})
export class ViewerSiteModule {}
