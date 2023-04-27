import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category as CategoryModel, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { HelperService } from '../common/helper/helper.service';
import { CreateCategoriseDto } from './dto/create-categorise.dto';
import { QueryCategoriseDto } from './dto/query-categorise.dto';
import { UpdateCategoriseDto } from './dto/update-categorise.dto';

@Injectable()
export class CategoriseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
  ) {}

  async create(categoriseDto: CreateCategoriseDto): Promise<CategoryModel> {
    const { name, description } = categoriseDto;

    return await this.prisma.category.create({ data: { name, description } });
  }

  async findAll(query: QueryCategoriseDto): Promise<any> {
    const { page = 1, limit = 10, search } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.CategoryWhereInput = search
      ? {
          name: { contains: search },
        }
      : undefined;

    const [categories, count] = await Promise.all([
      this.prisma.category.findMany({
        where,
        take,
        skip,
        select: {
          _count: { select: { subCategories: true, book: true } },
          id: true,
          name: true,
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      categories,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<CategoryModel | undefined> {
    return await this.prisma.category.findUnique({ where: { id } });
  }

  async update(
    id: number,
    categoriseDto: UpdateCategoriseDto,
  ): Promise<CategoryModel> {
    const exsis: CategoryModel = await this.helper.checkUniqueData(
      'category',
      'name',
      categoriseDto.name,
    );

    if (exsis && exsis.id != id) {
      throw new HttpException(
        {
          state: HttpStatus.BAD_REQUEST,
          error: 'ໝວດໝູ່ນີ້ມີຢູ່ແລ້ວ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.category.update({
      where: {
        id: id,
      },
      data: categoriseDto,
    });
  }

  async remove(id: number): Promise<CategoryModel> {
    const exsis: boolean = await this.helper.checkIdIsExsis('category', id);

    if (!exsis) {
      throw new HttpException(
        {
          state: HttpStatus.BAD_REQUEST,
          error: 'id ບໍ່ມີໃນລະບົບ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.category.delete({ where: { id: id } });
  }
}
