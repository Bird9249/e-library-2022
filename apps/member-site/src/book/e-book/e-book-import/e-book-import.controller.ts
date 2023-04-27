import {
  Controller,
  Get,
  Post,
  Body,
  Sse,
  Param,
  Delete,
  Query,
  Request,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EBookImportService } from './e-book-import.service';
import { validate } from 'class-validator';
import { CreateEBookImportDto } from './dto/create-e-book-import.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { map, Subject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetByIdPipe } from 'apps/member-site/src/custom-pip/get-by-id.decorator';
import { QueryBookImportDto } from '../../dto/query-book-import.dto';
import { ImportFilesDto } from '../../dto/import-files.dto';
import { PermissionGuard } from 'apps/member-site/src/custom-guard/permission/permission.guard';
import { Permission } from 'apps/member-site/src/custom-decorator/permission/permission.decorator';
import { LibraryPermissionGuard } from 'apps/member-site/src/custom-guard/library-permission/library-permission.guard';
import { LibPermission } from 'apps/member-site/src/custom-decorator/library-permission/library-permission.decorator';
import { BookQueryDto } from '../../dto/book-query.dto';

@UseGuards(JwtAuthGuard, PermissionGuard, LibraryPermissionGuard)
@LibPermission('create-ebook')
@Permission('manage-book')
@Controller('e-book-import')
export class EBookImportController {
  constructor(
    private readonly eBookImportService: EBookImportService,
    private readonly eventEmiiter: EventEmitter2,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() eBookImportDto: CreateEBookImportDto,
    @Request() req,
  ): Promise<any> {
    const filesDto = new ImportFilesDto();
    filesDto.files = files;

    const errors = await validate(filesDto);
    if (errors.length > 0) {
      return errors[0].constraints;
    }

    return this.eBookImportService.create(
      eBookImportDto,
      filesDto,
      req.user.id,
    );
  }

  @Get()
  findImportHis(
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) query: QueryBookImportDto,
  ): Promise<any> {
    return this.eBookImportService.findAll(req.user.libraryId, query);
  }

  @Get(':id')
  findOne(
    @Param('id', new GetByIdPipe('importHistory')) id: number,
    @Query(new ValidationPipe({ transform: true })) query: BookQueryDto,
  ) {
    return this.eBookImportService.findOne(id, query);
  }

  @Delete(':id')
  remove(@Param('id', new GetByIdPipe('importHistory')) id: number) {
    return this.eBookImportService.remove(id);
  }

  @Sse('progress-import-e-book/:jobId')
  progress(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.progress.e-book-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }

  @Sse('failed-import-e-book/:jobId')
  failed(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.failed.e-book-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }

  @Sse('completed-import-e-book/:jobId')
  completed(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.completed.e-book-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }
}
