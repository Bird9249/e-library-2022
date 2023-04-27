import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Library as LibraryModel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from '../custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../custom-guard/permission/permission.guard';
import { GetByIdPipe } from '../custom-pip/get-by-id.decorator';
import { UploadFileService } from '../upload-file/upload-file.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { LibraryService } from './library.service';

@Controller('library')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-library')
export class LibraryController {
  constructor(
    private readonly libraryService: LibraryService,
    private readonly upload: UploadFileService,
  ) {}

  @Post()
  async create(
    @Body() createLibraryDto: CreateLibraryDto,
    @Request() req,
  ): Promise<LibraryModel> {
    return await this.libraryService.create(createLibraryDto, req.user.id);
  }

  @Post('profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ): Promise<any> {
    return await this.libraryService.uploadProFile(file, req.user.libraryId);
  }

  @Post('background')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBackground(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ): Promise<any> {
    return await this.libraryService.uploadBackground(file, req.user.libraryId);
  }

  @Get(':id')
  async detailLibrary(
    @Param('id', new GetByIdPipe('library')) id: number,
  ): Promise<any> {
    return await this.libraryService.detailLib(id);
  }

  @Put(':id')
  async updateLibrary(
    @Param('id', new GetByIdPipe('library')) id: number,
    @Body() libraryDto: UpdateLibraryDto,
  ): Promise<any> {
    return await this.libraryService.updateLibrary(id, libraryDto);
  }

  @Patch(':libId')
  async upgradeStorage(
    @Param('libId', new GetByIdPipe('library')) libId: number,
    @Body() storageDto: UpdateStorageDto,
  ): Promise<any> {
    return await this.libraryService.upgradeStorage(libId, storageDto);
  }
}
