import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupportedBanner as SupportedBannerModel } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permission } from '../../common/custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../../common/custom-guard/permission/permission.guard';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { UploadFileService } from '../../upload-file/upload-file.service';
import { CreateSupportAdDto } from './dto/create-support-ad.dto';
import { QuerySupportAdDto } from './dto/query-support-ad.dto';
import { UpdateSupportAdDto } from './dto/update-support-ad.dto';
import { SupportAdService } from './support-ad.service';

@Controller('support-ad')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-advertising')
export class SupportAdController {
  constructor(
    private readonly supportAdService: SupportAdService,
    private readonly upload: UploadFileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('banner'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    banner: Express.Multer.File,
    @Body() supportAdDto: CreateSupportAdDto,
  ): Promise<SupportedBannerModel> {
    const start = new Date(supportAdDto.durationStart);
    const end = new Date(supportAdDto.durationEnd);

    if (Number(start) >= Number(end)) {
      throw new HttpException(
        'ວັນທີ່ເລີ່ມຕ້ອງນ້ອຍກວ່າວັນໝົດອາຍຸ',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.supportAdService.create(supportAdDto, banner);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QuerySupportAdDto,
  ): Promise<SupportedBannerModel[]> {
    return await this.supportAdService.findAll(query);
  }

  @Put(':id')
  async update(
    @Param('id', new GetByIdPipe('supportedBanner')) id: number,
    @Body() supportAdDto: UpdateSupportAdDto,
  ): Promise<SupportedBannerModel> {
    return await this.supportAdService.update(id, supportAdDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('banner'))
  async updateBanner(
    @Param('id', new GetByIdPipe('supportedBanner')) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    banner: Express.Multer.File,
  ): Promise<string> {
    return await this.supportAdService.updateBanner(id, banner);
  }

  @Delete(':id')
  async remove(
    @Param('id', new GetByIdPipe('supportedBanner')) id: number,
  ): Promise<SupportedBannerModel> {
    return await this.supportAdService.remove(id);
  }
}
