import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  Request,
  HttpException,
  HttpStatus,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Banner as BannerModel, Book as BookModel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LibPermission } from '../custom-decorator/library-permission/library-permission.decorator';
import { Permission } from '../custom-decorator/permission/permission.decorator';
import { LibraryPermissionGuard } from '../custom-guard/library-permission/library-permission.guard';
import { PermissionGuard } from '../custom-guard/permission/permission.guard';
import { AdvertisingService } from './advertising.service';
import { CreateAdvertisingDto } from './dto/create-advertising.dto';
import { QueryAdvertisingDto } from './dto/query-advertising.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { UpdateAdvertisingDto } from './dto/update-advertising.dto';
import { ValidationService } from './validation.service';

@Controller('advertising')
@UseGuards(JwtAuthGuard, PermissionGuard, LibraryPermissionGuard)
@LibPermission('advertising')
@Permission('manage-advertising')
export class AdvertisingController {
  constructor(
    private readonly advertisingService: AdvertisingService,
    private readonly validation: ValidationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('books')
  async findBooks(
    @Query(new ValidationPipe({ transform: true })) query: QueryBookDto,
    @Request() req,
  ): Promise<BookModel[]> {
    return await this.advertisingService.allBooks(query, req.user.id);
  }

  @Post()
  async create(
    @Body() advertisingDto: CreateAdvertisingDto,
    @Request() req,
  ): Promise<BannerModel> {
    const validate = await this.validation.bookInLibrary(
      advertisingDto.bookId,
      req.user.id,
    );

    if (!validate.status) {
      throw new HttpException(validate.message, HttpStatus.BAD_REQUEST);
    }

    return await this.advertisingService.create(advertisingDto, req.user.id);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryAdvertisingDto,
    @Request() req,
  ): Promise<BannerModel[]> {
    return await this.advertisingService.findAll(query, req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<BannerModel> {
    const validate = await this.validation.bannerInLibrary(id, req.user.id);

    if (!validate.status) {
      throw new HttpException(validate.message, HttpStatus.BAD_REQUEST);
    }

    return await this.advertisingService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() advertisingDto: UpdateAdvertisingDto,
    @Request() req,
  ): Promise<BannerModel> {
    const validate = await this.validation.bannerStatus(id, req.user.id);

    if (!validate.status) {
      throw new HttpException(validate.message, HttpStatus.BAD_REQUEST);
    }

    return await this.advertisingService.update(id, advertisingDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<BannerModel> {
    const validate = await this.validation.bannerStatus(id, req.user.id);

    if (!validate.status) {
      throw new HttpException(validate.message, HttpStatus.BAD_REQUEST);
    }

    return await this.advertisingService.remove(id);
  }
}
