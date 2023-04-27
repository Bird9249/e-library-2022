import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { QueryLanguageDto } from './dto/query-language.dto';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: QueryLanguageDto) {
    const { page = 1, limit = 10, language } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    let where: any = undefined;

    if (language) {
      where = {
        language: {
          contains: language,
        },
      };
    }

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

  async create(body: CreateLanguageDto) {
    const { language } = body;

    return await this.prisma.language.create({
      data: {
        language,
      },
    });
  }
}
