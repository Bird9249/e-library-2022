import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryLibraryDto } from './dto/query-library.dto';

@Injectable()
export class LibraryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async findAll(query: QueryLibraryDto): Promise<any> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.LibraryWhereInput = search
      ? { title: { contains: search } }
      : undefined;
    const [libraries, count] = await Promise.all([
      await this.prisma.library.findMany({
        where,
        select: {
          id: true,
          profileUrl: true,
          title: true,
          type: true,
        },
        take,
        skip,
      }),
      this.prisma.library.count({ where }),
    ]);

    const items = libraries.map((library) => ({
      ...library,
      profileUrl: library.profileUrl
        ? this.config.get<string>('ADMIN_BASE_URL') + library.profileUrl
        : library.profileUrl,
    }));

    return {
      libraries: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<any | undefined> {
    const library = await this.prisma.library.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        type: true,
        sector: true,
        operationDate: true,
        profileUrl: true,
        backgroundUrl: true,
        libraryLimitStorage: {
          select: { storageLimit: true, currentStorage: true },
        },
        memberAccount: {
          select: {
            id: true,
            memberName: true,
            memberInfo: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    const result = {
      ...library,
      libraryLimitStorage: {
        storageLimit: Number(library.libraryLimitStorage.storageLimit),
        currentStorage: Number(library.libraryLimitStorage.currentStorage),
      },
      profileUrl: library.profileUrl
        ? this.config.get<string>('ADMIN_BASE_URL') + library.profileUrl
        : library.profileUrl,
      backgroundUrl: library.backgroundUrl
        ? this.config.get<string>('ADMIN_BASE_URL') + library.backgroundUrl
        : library.backgroundUrl,
    };

    return result;
  }
}
