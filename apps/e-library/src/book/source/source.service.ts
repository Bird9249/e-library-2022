import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Source } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QuerySourceDto } from './dto/query-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

@Injectable()
export class SourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuerySourceDto) {
    const { page, limit, name } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.SourceWhereInput = name
      ? { name: { contains: name } }
      : undefined;

    const [items, count] = await Promise.all([
      this.prisma.source.findMany({
        where,
        take,
        skip,
      }),
      this.prisma.source.count({ where }),
    ]);

    return {
      sources: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async update(id: number, body: UpdateSourceDto): Promise<Source> {
    return await this.prisma.source.update({ where: { id }, data: body });
  }

  async remove(id: number) {
    const source = await this.prisma.source.findUnique({
      where: { id },
      include: { book: true },
    });

    if (source.book.length > 0) {
      throw new BadRequestException('ຍັງມີປື້ມທີ່ໃຊ້ຂໍ້ມູນນີ້ຢູ່');
    }

    return await this.prisma.source.delete({ where: { id } });
  }
}
