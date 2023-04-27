import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BookAdModule } from './advertising/book-ad/book-ad.module';
import { SupportAdModule } from './advertising/support-ad/support-ad.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './auth/constants';
import { BooksModule } from './book/books/books.module';
import { CategoriseModule } from './book/categorise/categorise.module';
import { HelperService } from './book/common/helper/helper.service';
import { SubCategoriseModule } from './book/sub-categorise/sub-categorise.module';
import { CreateRequestModule } from './library/create-request/create-request.module';
import { LibraryModule } from './library/library/library.module';
import { UpdateRequestModule } from './library/update-request/update-request.module';
import { MailModule } from './mail/mail.module';
import { PrismaService } from './prisma/prisma.service';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

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
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1y',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public'),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    MailModule,
    CategoriseModule,
    SubCategoriseModule,
    BooksModule,
    LibraryModule,
    CreateRequestModule,
    UpdateRequestModule,
    BookAdModule,
    SupportAdModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, HelperService],
})
export class AppModule {}
