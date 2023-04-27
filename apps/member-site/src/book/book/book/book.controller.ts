import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Request,
  UploadedFiles,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Book as BookModel } from '@prisma/client';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { BookService } from './book.service';
import { ValidationService } from '../../../common/validation.service';
import { validate } from 'class-validator';
import { BookFiles } from 'apps/member-site/src/common/interface/interface';
import { FilesDto } from './dto/files.dto';
import { BookQueryDto } from 'apps/member-site/src/book/dto/book-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetByIdPipe } from 'apps/member-site/src/custom-pip/get-by-id.decorator';
import { PermissionGuard } from 'apps/member-site/src/custom-guard/permission/permission.guard';
import { Permission } from 'apps/member-site/src/custom-decorator/permission/permission.decorator';
import { LibraryPermissionGuard } from 'apps/member-site/src/custom-guard/library-permission/library-permission.guard';
import { LibPermission } from 'apps/member-site/src/custom-decorator/library-permission/library-permission.decorator';

@UseGuards(JwtAuthGuard, PermissionGuard, LibraryPermissionGuard)
@LibPermission('create-book')
@Permission('manage-book')
@Controller('book')
export class BookController {
  constructor(
    private readonly book: BookService,
    private readonly validate: ValidationService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'content', maxCount: 1 },
    ]),
  )
  async uploadFile(
    @UploadedFiles()
    files: BookFiles,
    @Request() req,
  ) {
    const fileDto = new FilesDto();
    fileDto.cover = files.cover ? files.cover[0] : null;
    fileDto.content = files.content ? files.content[0] : null;

    const errors = await validate(fileDto);
    if (errors.length > 0) {
      return errors[0].constraints;
    }

    await this.validate.checkStorage(req.user.libraryId, null, fileDto.content);

    return await this.book.uploadFile(fileDto, req.user.libraryId);
  }

  @Post()
  async create(
    @Body()
    bookDto: CreateBookDto,
    @Request() req,
  ) {
    return await this.book.create(bookDto, req.user.id, req.user.libraryId);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: BookQueryDto,
    @Request() req,
  ): Promise<BookModel[]> {
    return this.book.findAll(query, req.user.libraryId);
  }

  @Get(':id')
  findOne(
    @Param('id', new GetByIdPipe('book')) id: number,
  ): Promise<BookModel | undefined> {
    return this.book.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new GetByIdPipe('book')) id: number,
    @Body() bookDto: UpdateBookDto,
  ) {
    return this.book.update(id, bookDto);
  }

  @Delete(':id')
  remove(@Param('id', new GetByIdPipe('book')) id: number) {
    return this.book.remove(id);
  }
}
