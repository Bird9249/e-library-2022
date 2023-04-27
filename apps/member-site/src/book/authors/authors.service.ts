import { Injectable } from '@nestjs/common';
import { Author as AuthorModel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { QueryAuthorDto } from './dto/query-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorDto: CreateAuthorDto): Promise<AuthorModel> {
    const { fullname, major, phoneNumber, email } = authorDto;

    return await this.prisma.author.create({
      data: {
        fullName: fullname,
        major,
        phoneNumber,
        email,
      },
    });
  }

  async findAll(query: QueryAuthorDto): Promise<any> {
    const { page = 1, limit = 10, name } = query;
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
        select: {
          id: true,
          fullName: true,
        },
      }),
      this.prisma.author.count({ where }),
    ]);

    return {
      authors: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }
}
