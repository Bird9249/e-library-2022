import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Category as CategoryModel } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permission } from '../../common/custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../../common/custom-guard/permission/permission.guard';
import { MergeParamsAndBody } from '../../common/custom-interceptor/merge-param-and-body.interceptor';
import { GetByIdPipe } from '../../common/custom-pip/get-by-id.pipe';
import { CategoriseService } from './categorise.service';
import { CreateCategoriseDto } from './dto/create-categorise.dto';
import { QueryCategoriseDto } from './dto/query-categorise.dto';
import { UpdateCategoriseDto } from './dto/update-categorise.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-book')
export class CategoriseController {
  constructor(private readonly categoriseService: CategoriseService) {}

  @Post()
  async create(
    @Body() categoriseDto: CreateCategoriseDto,
  ): Promise<CategoryModel> {
    return await this.categoriseService.create(categoriseDto);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryCategoriseDto,
  ) {
    return this.categoriseService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryModel | undefined> {
    return await this.categoriseService.findOne(id);
  }

  @UseInterceptors(MergeParamsAndBody)
  @Patch(':id')
  async update(
    @Param('id', new GetByIdPipe('category'))
    id: number,
    @Body(new ValidationPipe({ transform: true }))
    categoriseDto: UpdateCategoriseDto,
  ): Promise<CategoryModel> {
    return await this.categoriseService.update(id, categoriseDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new GetByIdPipe('category')) id: number,
  ): Promise<CategoryModel> {
    return await this.categoriseService.remove(id);
  }
}
