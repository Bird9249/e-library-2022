import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Request,
  Query,
  UseGuards,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { EBookService } from './e-book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BookFiles } from 'apps/member-site/src/common/interface/interface';
import { FilesDto } from 'apps/member-site/src/book/e-book/e-book/dto/files.dto';
import { validate } from 'class-validator';
import { ValidationService } from 'apps/member-site/src/common/validation.service';
import { BookQueryDto } from '../../dto/book-query.dto';
import { JwtAuthGuard } from 'apps/member-site/src/auth/jwt-auth.guard';
import { GetByIdPipe } from 'apps/member-site/src/custom-pip/get-by-id.decorator';
import { PermissionGuard } from 'apps/member-site/src/custom-guard/permission/permission.guard';
import { Permission } from 'apps/member-site/src/custom-decorator/permission/permission.decorator';
import { LibraryPermissionGuard } from 'apps/member-site/src/custom-guard/library-permission/library-permission.guard';
import { LibPermission } from 'apps/member-site/src/custom-decorator/library-permission/library-permission.decorator';

@UseGuards(JwtAuthGuard, PermissionGuard, LibraryPermissionGuard)
@LibPermission('create-ebook')
@Permission('manage-book')
@Controller('e-book')
export class EBookController {
  constructor(
    private readonly eBookService: EBookService,
    private readonly validate: ValidationService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'content', maxCount: 1 },
      { name: 'bookFile', maxCount: 1 },
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
    fileDto.bookFile = files.bookFile ? files.bookFile[0] : null;

    const errors = await validate(fileDto);
    if (errors.length > 0) {
      return errors[0].constraints;
    }

    await this.validate.checkStorage(
      req.user.libraryId,
      fileDto.bookFile,
      fileDto.content,
    );

    return await this.eBookService.uploadFile(fileDto, req.user.libraryId);
  }

  @Post()
  async create(
    @Body()
    bookDto: CreateBookDto,
    @Request() req,
  ): Promise<any> {
    return await this.eBookService.create(
      bookDto,
      req.user.id,
      req.user.libraryId,
    );
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: BookQueryDto,
    @Request() req,
  ): Promise<any[]> {
    return this.eBookService.findAll(query, req.user.libraryId);
  }

  @Get(':id')
  findOne(@Param('id', new GetByIdPipe('book')) id: number) {
    return this.eBookService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new GetByIdPipe('book')) id: number,
    @Body() bookDto: UpdateBookDto,
  ) {
    return this.eBookService.update(id, bookDto);
  }

  @Delete(':id')
  remove(@Param('id', new GetByIdPipe('book')) id: number) {
    return this.eBookService.remove(id);
  }
}
