import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubCategoriseDto } from './dto/create-sub-categorise.dto';
import {
  Category as CategoryModel,
  Prisma,
  SubCategory as SubCategoryModel,
} from '@prisma/client';
import { UpdateSubCategoriseDto } from './dto/update-sub-categorise.dto';
import { HelperService } from '../common/helper/helper.service';
import { QuerySubCategoriseDto } from './dto/query-sub-categorise.dto';

@Injectable()
export class SubCategoriseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
  ) {}

  async findCategory(): Promise<CategoryModel[]> {
    return await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(subCategoriseDto: CreateSubCategoriseDto) {
    return await this.prisma.subCategory.create({
      data: subCategoriseDto,
    });
  }

  async findAll(query: QuerySubCategoriseDto): Promise<any> {
    const { page = 1, limit = 10, search, catId } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.SubCategoryWhereInput = {
      AND: [
        search
          ? {
              name: { contains: search },
            }
          : undefined,

        catId ? { categoryId: catId } : undefined,
      ],
    };
    const [subCategories, count] = await Promise.all([
      await this.prisma.subCategory.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          name: true,
          categories: {
            select: { name: true },
          },
          _count: {
            select: { book: true },
          },
        },
      }),
      this.prisma.subCategory.count({ where }),
    ]);

    return {
      subCategories,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<SubCategoryModel | undefined> {
    return await this.prisma.subCategory.findUnique({ where: { id } });
  }

  async update(
    id: number,
    subCategoriseDto: UpdateSubCategoriseDto,
  ): Promise<SubCategoryModel> {
    const exsis: SubCategoryModel = await this.helper.checkUniqueData(
      'subCategory',
      'name',
      subCategoriseDto.name,
    );

    if (exsis && exsis.id != id) {
      throw new HttpException(
        {
          state: HttpStatus.BAD_REQUEST,
          error: 'ປະເພດນີ້ມີຢູ່ແລ້ວ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.subCategory.update({
      where: { id },
      data: subCategoriseDto,
    });
  }

  async remove(id: number): Promise<SubCategoryModel> {
    const exsis: boolean = await this.helper.checkIdIsExsis('subCategory', id);

    if (!exsis) {
      throw new HttpException(
        {
          state: HttpStatus.BAD_REQUEST,
          error: 'id ບໍ່ມີໃນລະບົບ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.subCategory.delete({ where: { id } });
  }
}
