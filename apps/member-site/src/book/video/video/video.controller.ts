import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Delete,
  UploadedFiles,
  Request,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BookFiles } from 'apps/member-site/src/common/interface/interface';
import { JwtAuthGuard } from 'apps/member-site/src/auth/jwt-auth.guard';
import { validate } from 'class-validator';
import { ValidationService } from 'apps/member-site/src/common/validation.service';
import { FilesVideoDto } from './dto/files-video.dto';
import { BookQueryDto } from '../../dto/book-query.dto';
import { GetByIdPipe } from 'apps/member-site/src/custom-pip/get-by-id.decorator';
import { Put } from '@nestjs/common/decorators';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PermissionGuard } from 'apps/member-site/src/custom-guard/permission/permission.guard';
import { Permission } from 'apps/member-site/src/custom-decorator/permission/permission.decorator';
import { LibraryPermissionGuard } from 'apps/member-site/src/custom-guard/library-permission/library-permission.guard';
import { LibPermission } from 'apps/member-site/src/custom-decorator/library-permission/library-permission.decorator';

@Controller('video')
@UseGuards(JwtAuthGuard, PermissionGuard, LibraryPermissionGuard)
@LibPermission('create-video')
@Permission('manage-book')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly validateService: ValidationService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'videoFile', maxCount: 1 },
    ]),
  )
  async uploadFile(
    @UploadedFiles()
    files: BookFiles,
    @Request() req,
  ) {
    const fileDto = new FilesVideoDto();
    fileDto.cover = files.cover ? files.cover[0] : null;
    fileDto.videoFile = files.videoFile ? files.videoFile[0] : null;

    const errors = await validate(fileDto);
    if (errors.length > 0) {
      return errors[0].constraints;
    }

    await this.validateService.checkStorage(
      req.user.libraryId,
      fileDto.videoFile,
      null,
    );

    return await this.videoService.uploadFile(fileDto, req.user.libraryId);
  }

  @Post()
  async create(
    @Body()
    videoDto: CreateVideoDto,
    @Request() req,
  ) {
    return this.videoService.create(videoDto, req.user.id, req.user.libraryId);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: BookQueryDto,
    @Request() req,
  ): Promise<any[]> {
    return this.videoService.findAll(query, req.user.libraryId);
  }

  @Get(':id')
  findOne(@Param('id', new GetByIdPipe('book')) id: number) {
    return this.videoService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new GetByIdPipe('book')) id: number,
    @Body() videoDto: UpdateVideoDto,
  ) {
    return this.videoService.update(id, videoDto);
  }

  @Delete(':id')
  remove(@Param('id', new GetByIdPipe('book')) id: number) {
    return this.videoService.remove(id);
  }
}
