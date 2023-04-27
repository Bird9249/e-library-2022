import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Request,
  UploadedFiles,
  ParseIntPipe,
  Sse,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AudioImportService } from './audio-import.service';
import { CreateAudioImportDto } from './dto/create-audio-import.dto';
import { ImportFilesDto } from '../../dto/import-files.dto';
import { validate } from 'class-validator';
import { map, Subject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from 'apps/member-site/src/auth/jwt-auth.guard';
import { QueryBookImportDto } from '../../dto/query-book-import.dto';
import { GetByIdPipe } from 'apps/member-site/src/custom-pip/get-by-id.decorator';
import { PermissionGuard } from 'apps/member-site/src/custom-guard/permission/permission.guard';
import { Permission } from 'apps/member-site/src/custom-decorator/permission/permission.decorator';
import { LibraryPermissionGuard } from 'apps/member-site/src/custom-guard/library-permission/library-permission.guard';
import { LibPermission } from 'apps/member-site/src/custom-decorator/library-permission/library-permission.decorator';
import { BookQueryDto } from '../../dto/book-query.dto';

@UseGuards(JwtAuthGuard, PermissionGuard, LibraryPermissionGuard)
@LibPermission('create-audio')
@Permission('manage-book')
@Controller('audio-import')
export class AudioImportController {
  constructor(
    private readonly audioImportService: AudioImportService,
    private readonly eventEmiiter: EventEmitter2,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() audioImportDto: CreateAudioImportDto,
    @Request() req,
  ): Promise<any> {
    const filesDto = new ImportFilesDto();
    filesDto.files = files;

    const errors = await validate(filesDto);
    if (errors.length > 0) {
      return errors[0].constraints;
    }

    return this.audioImportService.create(
      audioImportDto,
      filesDto,
      req.user.id,
    );
  }

  @Get()
  findImportHis(
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) query: QueryBookImportDto,
  ): Promise<any> {
    return this.audioImportService.findAll(req.user.libraryId, query);
  }

  @Get(':id')
  findOne(
    @Param('id', new GetByIdPipe('importHistory')) id: number,
    @Query(new ValidationPipe({ transform: true }))
    query: BookQueryDto,
  ) {
    return this.audioImportService.findOne(id, query);
  }

  @Delete(':id')
  remove(@Param('id', new GetByIdPipe('importHistory')) id: number) {
    return this.audioImportService.remove(id);
  }

  @Sse('progress-import-audio/:jobId')
  progress(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.progress.audio-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }

  @Sse('failed-import-audio/:jobId')
  failed(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.failed.audio-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }

  @Sse('completed-import-audio/:jobId')
  completed(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.completed.audio-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }
}
