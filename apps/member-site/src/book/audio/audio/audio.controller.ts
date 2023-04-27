import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Query,
  Request,
  UploadedFiles,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'apps/member-site/src/auth/jwt-auth.guard';
import { BookFiles } from 'apps/member-site/src/common/interface/interface';
import { ValidationService } from 'apps/member-site/src/common/validation.service';
import { LibPermission } from 'apps/member-site/src/custom-decorator/library-permission/library-permission.decorator';
import { Permission } from 'apps/member-site/src/custom-decorator/permission/permission.decorator';
import { LibraryPermissionGuard } from 'apps/member-site/src/custom-guard/library-permission/library-permission.guard';
import { PermissionGuard } from 'apps/member-site/src/custom-guard/permission/permission.guard';
import { GetByIdPipe } from 'apps/member-site/src/custom-pip/get-by-id.decorator';
import { validate } from 'class-validator';
import { BookQueryDto } from '../../dto/book-query.dto';
import { AudioService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilesAudioDto } from './dto/files-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';

@UseGuards(JwtAuthGuard, PermissionGuard, LibraryPermissionGuard)
@LibPermission('create-audio')
@Permission('manage-book')
@Controller('audio')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    private readonly validateService: ValidationService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cover', maxCount: 1 },
      { name: 'audioFile', maxCount: 1 },
    ]),
  )
  async uploadFile(
    @UploadedFiles()
    files: BookFiles,
    @Request() req,
  ) {
    const fileDto = new FilesAudioDto();
    fileDto.cover = files.cover ? files.cover[0] : null;
    fileDto.audioFile = files.audioFile ? files.audioFile[0] : null;

    const errors = await validate(fileDto);
    if (errors.length > 0) {
      return errors[0].constraints;
    }

    await this.validateService.checkStorage(
      req.user.libraryId,
      fileDto.audioFile,
      null,
    );

    return await this.audioService.uploadFile(fileDto, req.user.libraryId);
  }

  @Post()
  async create(
    @Body()
    audioDto: CreateAudioDto,
    @Request() req,
  ) {
    return this.audioService.create(audioDto, req.user.id, req.user.libraryId);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: BookQueryDto,
    @Request() req,
  ): Promise<any[]> {
    return this.audioService.findAll(query, req.user.libraryId);
  }

  @Get(':id')
  findOne(@Param('id', new GetByIdPipe('book')) id: number) {
    return this.audioService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new GetByIdPipe('book')) id: number,
    @Body() audioDto: UpdateAudioDto,
  ) {
    return this.audioService.update(id, audioDto);
  }

  @Delete(':id')
  remove(@Param('id', new GetByIdPipe('book')) id: number) {
    return this.audioService.remove(id);
  }
}
