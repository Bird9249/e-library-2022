import { BadRequestException, Injectable } from '@nestjs/common';
import { Author } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAuthorDto } from './dto/query-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryAuthorDto) {
    const { page, limit, name } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    let where: any = undefined;

    if (name) {
      where = {
        fullName: {
          contains: name,
        },
      };
    }

    const [items, count] = await Promise.all([
      this.prisma.author.findMany({
        where: where,
        take: Number(take),
        skip: Number(skip),
      }),
      this.prisma.author.count({ where }),
    ]);

    return {
      authors: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async update(id: number, body: Omit<UpdateAuthorDto, 'id'>): Promise<Author> {
    return await this.prisma.author.update({
      where: { id: id },
      data: body,
    });
  }

  async remove(id: number): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });

    if (author.books.length > 0) {
      throw new BadRequestException('ຍັງມີປື້ມທີ່ໃຊ້ຂໍ້ມູນນີ້ຢູ່');
    }

    return await this.prisma.author.delete({ where: { id } });
  }
}
