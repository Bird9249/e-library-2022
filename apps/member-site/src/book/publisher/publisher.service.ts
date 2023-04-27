import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { QueryPublisherDto } from './dto/query-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPublisherDto) {
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
      this.prisma.publisher.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          name: true,
        },
      }),
      this.prisma.publisher.count({ where }),
    ]);

    return {
      publishers: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  create(body: CreatePublisherDto) {
    return this.prisma.publisher.create({ data: body });
  }
}
