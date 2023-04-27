import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryBookAdDto } from './dto/query-book-ad.dto';

@Injectable()
export class BookAdService {
  constructor(
    private readonly prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async findAll(query: QueryBookAdDto): Promise<any> {
    const { page = 1, limit = 10, search, status } = query;
    const skip: number = (page - 1) * limit;
    const take: number = limit;

    const where: Prisma.BannerWhereInput = {
      AND: [search ? { id: search } : null, status ? { status } : null],
    };

    const [items, count] = await Promise.all([
      this.prisma.banner.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          book: {
            select: {
              title: true,
              coverUrl: true,
            },
          },
          durationStart: true,
          durationEnd: true,
          status: true,
          adminApprove: true,
        },
      }),
      this.prisma.banner.count({ where }),
    ]);

    const banners = items.map((banner) => ({
      ...banner,
      book: {
        coverUrl: banner.book.coverUrl
          ? this.config.get<string>('ADMIN_BASE_URL') + banner.book.coverUrl
          : banner.book.coverUrl,
      },
    }));

    return {
      banners,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async approveAd(id: number): Promise<any> {
    const data = await this.prisma.banner.update({
      where: { id: id },
      data: { adminApprove: true },
    });

    const result = {
      ...data,
      bookId: Number(data.bookId),
    };

    return result;
  }

  async detail(id: number): Promise<any | undefined> {
    const banner = await this.prisma.banner.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        durationStart: true,
        durationEnd: true,
        status: true,
        adminApprove: true,
        book: {
          select: {
            title: true,
            coverUrl: true,
          },
        },
        library: {
          select: {
            title: true,
            profileUrl: true,
          },
        },
      },
    });

    const result = {
      ...banner,
      book: {
        ...banner.book,
        coverUrl: banner.book.coverUrl
          ? this.config.get<string>('ADMIN_BASE_URL') + banner.book.coverUrl
          : banner.book.coverUrl,
      },
      library: {
        ...banner.library,
        profileUrl: banner.library.profileUrl
          ? this.config.get<string>('ADMIN_BASE_URL') +
            banner.library.profileUrl
          : banner.library.profileUrl,
      },
    };

    return result;
  }
}
