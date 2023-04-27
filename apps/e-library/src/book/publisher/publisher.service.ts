import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Publisher } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryPublisherDto } from './dto/query-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPublisherDto) {
    const { page, limit, name } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.PublisherWhereInput = name
      ? { name: { contains: name } }
      : undefined;

    const [items, count] = await Promise.all([
      this.prisma.publisher.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
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

  async findOne(id: number): Promise<Publisher | undefined> {
    return await this.prisma.publisher.findUnique({ where: { id } });
  }

  async update(
    id: number,
    body: Omit<UpdatePublisherDto, 'id'>,
  ): Promise<Publisher> {
    return await this.prisma.publisher.update({ where: { id }, data: body });
  }

  async remove(id: number) {
    const publisher = await this.prisma.publisher.findUnique({
      where: { id },
      include: { bookPDF: true },
    });

    if (publisher.bookPDF.length > 0) {
      throw new BadRequestException('ຍັງມີປື້ມທີ່ໃຊ້ຂໍ້ມູນນີ້ຢູ່');
    }

    return await this.prisma.publisher.delete({ where: { id } });
  }
}
