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
  Sse,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { VideoImportService } from './video-import.service';
import { CreateVideoImportDto } from './dto/create-video-import.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImportFilesDto } from '../../dto/import-files.dto';
import { validate } from 'class-validator';
import { QueryBookImportDto } from '../../dto/query-book-import.dto';
import { GetByIdPipe } from 'apps/member-site/src/custom-pip/get-by-id.decorator';
import { QueryBookFindOneImport } from '../../dto/query-book-find-one-import.dto';
import { JwtAuthGuard } from 'apps/member-site/src/auth/jwt-auth.guard';
import { map, Subject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PermissionGuard } from 'apps/member-site/src/custom-guard/permission/permission.guard';
import { Permission } from 'apps/member-site/src/custom-decorator/permission/permission.decorator';
import { LibraryPermissionGuard } from 'apps/member-site/src/custom-guard/library-permission/library-permission.guard';
import { LibPermission } from 'apps/member-site/src/custom-decorator/library-permission/library-permission.decorator';

@Controller('video-import')
@UseGuards(JwtAuthGuard, PermissionGuard, LibraryPermissionGuard)
@LibPermission('create-video')
@Permission('manage-book')
export class VideoImportController {
  constructor(
    private readonly videoImportService: VideoImportService,
    private readonly eventEmiiter: EventEmitter2,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() videoImportDto: CreateVideoImportDto,
    @Request() req,
  ): Promise<any> {
    const filesDto = new ImportFilesDto();
    filesDto.files = files;

    const errors = await validate(filesDto);
    if (errors.length > 0) {
      return errors[0].constraints;
    }

    return this.videoImportService.create(
      videoImportDto,
      filesDto,
      req.user.id,
    );
  }

  @Get()
  findImportHis(
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) query: QueryBookImportDto,
  ): Promise<any> {
    return this.videoImportService.findAll(req.user.libraryId, query);
  }

  @Get(':id')
  findOne(
    @Param('id', new GetByIdPipe('importHistory')) id: number,
    @Query() query: QueryBookFindOneImport,
  ) {
    return this.videoImportService.findOne(id, query);
  }

  @Delete(':id')
  remove(@Param('id', new GetByIdPipe('importHistory')) id: number) {
    return this.videoImportService.remove(id);
  }

  @Sse('progress-import-video/:jobId')
  progress(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.progress.video-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }

  @Sse('failed-import-video/:jobId')
  failed(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.failed.video-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }

  @Sse('completed-import-video/:jobId')
  completed(@Param('jobId', ParseIntPipe) jobId: number) {
    const subject = new Subject();

    this.eventEmiiter.on(`job.completed.video-${jobId}`, (event: string) => {
      subject.next({ event });
    });

    return subject.pipe(map((data: string) => ({ data })));
  }
}
