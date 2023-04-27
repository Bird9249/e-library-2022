import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Banner as BannerModel } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permission } from '../../common/custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../../common/custom-guard/permission/permission.guard';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { BookAdService } from './book-ad.service';
import { QueryBookAdDto } from './dto/query-book-ad.dto';

@Controller('book-ad')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-advertising')
export class BookAdController {
  constructor(private readonly bookAdService: BookAdService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryBookAdDto,
  ): Promise<BannerModel[]> {
    return await this.bookAdService.findAll(query);
  }

  @Patch(':id')
  async approveAd(
    @Param('id', new GetByIdPipe('banner')) id: number,
  ): Promise<BannerModel> {
    return await this.bookAdService.approveAd(id);
  }

  @Get(':id')
  async findDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BannerModel | undefined> {
    return await this.bookAdService.detail(id);
  }
}
