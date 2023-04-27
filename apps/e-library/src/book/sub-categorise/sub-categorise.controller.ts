import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  Category as CategoryModel,
  SubCategory as SubCategoryModel,
} from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permission } from '../../common/custom-decorator/permission/permission.decorator';
import { PermissionGuard } from '../../common/custom-guard/permission/permission.guard';
import { MergeParamsAndBody } from '../../common/custom-interceptor/merge-param-and-body.interceptor';
import { CreateSubCategoriseDto } from './dto/create-sub-categorise.dto';
import { QuerySubCategoriseDto } from './dto/query-sub-categorise.dto';
import { UpdateSubCategoriseDto } from './dto/update-sub-categorise.dto';
import { SubCategoriseService } from './sub-categorise.service';

@Controller('sub-categories')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permission('manage-book')
export class SubCategoriseController {
  constructor(private readonly subCategoriseService: SubCategoriseService) {}

  @Get('categories')
  async findCategory(): Promise<CategoryModel[]> {
    return await this.subCategoriseService.findCategory();
  }

  @Post()
  async create(
    @Body() subCategoriseDto: CreateSubCategoriseDto,
  ): Promise<SubCategoryModel> {
    return await this.subCategoriseService.create(subCategoriseDto);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QuerySubCategoriseDto,
  ) {
    return this.subCategoriseService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SubCategoryModel | undefined> {
    return await this.subCategoriseService.findOne(id);
  }

  @UseInterceptors(MergeParamsAndBody)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    subCategoriseDto: UpdateSubCategoriseDto,
  ) {
    return await this.subCategoriseService.update(id, subCategoriseDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SubCategoryModel> {
    return await this.subCategoriseService.remove(id);
  }
}
