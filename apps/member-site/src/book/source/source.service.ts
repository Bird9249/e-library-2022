import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { QuerySourceDto } from './dto/query-source.dto';

@Injectable()
export class SourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuerySourceDto) {
    const { page = 1, limit = 10, name } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    let where: any = undefined;

    if (name) {
      where = {
        name: {
          contains: name,
        },
      };
    }

    const [items, count] = await Promise.all([
      this.prisma.source.findMany({
        where: where,
        take: take,
        skip: skip,
      }),
      this.prisma.source.count({ where }),
    ]);

    return {
      sources: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async create(createSourceDto: CreateSourceDto) {
    const { name } = createSourceDto;

    return await this.prisma.source.create({
      data: {
        name,
      },
    });
  }
}
