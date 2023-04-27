import { BadRequestException, Injectable } from '@nestjs/common';
import { Language, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryLanguageDto } from './dto/query-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryLanguageDto) {
    const { page, limit, language } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.LanguageWhereInput = language
      ? { language: { contains: language } }
      : undefined;

    const [items, count] = await Promise.all([
      this.prisma.language.findMany({
        where,
        take,
        skip,
      }),
      this.prisma.language.count({ where }),
    ]);

    return {
      languages: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async update(id: number, body: UpdateLanguageDto): Promise<Language> {
    return await this.prisma.language.update({ where: { id }, data: body });
  }

  async remove(id: number): Promise<Language> {
    const language = await this.prisma.language.findUnique({
      where: { id },
      include: { Book: true },
    });

    if (language.Book.length > 0) {
      throw new BadRequestException('ຍັງມີປື້ມທີ່ໃຊ້ຂໍ້ມູນນີ້ຢູ່');
    }

    return await this.prisma.language.delete({ where: { id } });
  }
}
