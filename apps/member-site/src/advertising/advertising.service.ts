import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Banner as BannerModel, BannerStatus } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdvertisingDto } from './dto/create-advertising.dto';
import { QueryAdvertisingDto } from './dto/query-advertising.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { UpdateAdvertisingDto } from './dto/update-advertising.dto';

@Injectable()
export class AdvertisingService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('book-ad') private readonly bookAdQueue: Queue,
    private readonly config: ConfigService,
  ) {}

  async allBooks(query: QueryBookDto, memberId: number): Promise<any> {
    const { page = 1, limit = 10, title } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where = { AND: [] };

    where.AND.push({
      bookLibrary: {
        library: {
          memberAccount: {
            some: {
              id: memberId,
            },
          },
        },
      },
    });

    if (title) {
      where.AND.push({ title: { contains: title } });
    }

    const [items, count] = await Promise.all([
      this.prisma.book.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          title: true,
          coverUrl: true,
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    const books = items.map((book) => ({
      ...book,
      id: Number(book.id),
      coverUrl: book.coverUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + book.coverUrl
        : book.coverUrl,
    }));

    return {
      books,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async create(
    advertisingDto: CreateAdvertisingDto,
    memberId: number,
  ): Promise<BannerModel> {
    const { bookId, title, durationStart, durationEnd } = advertisingDto;

    const member = await this.prisma.memberAccount.findUnique({
      where: { id: memberId },
      select: {
        libraryId: true,
      },
    });

    let status: BannerStatus;
    let milliseconds: number;

    if (Number(new Date(durationStart)) > Date.now()) {
      status = BannerStatus.pending;

      milliseconds = Number(new Date(durationStart)) - Date.now();
    } else if (Number(new Date(durationStart)) <= Date.now()) {
      status = BannerStatus.active;

      milliseconds = Number(new Date(durationEnd)) - Date.now();
    } else if (Number(new Date(durationEnd)) <= Date.now()) {
      status = BannerStatus.expired;
    }

    const banner = await this.prisma.banner.create({
      data: {
        libraryId: member.libraryId,
        bookId: Number(bookId),
        title,
        durationStart: new Date(durationStart),
        durationEnd: new Date(durationEnd),
        status,
        adminApprove: false,
      },
    });

    this.bookAdQueue.add(
      {
        id: banner.id,
        durationEnd: Number(new Date(banner.durationEnd)),
        status: banner.status,
      },
      { delay: milliseconds },
    );

    const result: any = {
      ...banner,
      bookId: Number(banner.bookId),
    };

    return result;
  }

  async findAll(query: QueryAdvertisingDto, memberId: number): Promise<any> {
    const { page = 1, limit = 10, id } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where = { AND: [] };

    where.AND.push({
      library: {
        memberAccount: {
          some: { id: memberId },
        },
      },
    });

    if (id) {
      where.AND.push({ id: id });
    }

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

    const result = items.map((item) => ({
      ...item,
      book: {
        ...item.book,
        coverUrl: item.book.coverUrl
          ? this.config.get<string>('MEMBER_BASE_URL') + item.book.coverUrl
          : item.book.coverUrl,
      },
    }));

    return {
      banners: result,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<any | undefined> {
    const result = await this.prisma.banner.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        book: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
        },
        durationStart: true,
        durationEnd: true,
        status: true,
        adminApprove: true,
      },
    });

    const data: any = {
      ...result,
      book: {
        ...result.book,
        id: Number(result.book.id),
        coverUrl: result.book.coverUrl
          ? this.config.get<string>('MEMBER_BASE_URL') + result.book.coverUrl
          : result.book.coverUrl,
      },
    };

    return data;
  }

  async update(
    id: number,
    advertisingDto: UpdateAdvertisingDto,
  ): Promise<BannerModel> {
    const { title, durationStart, durationEnd } = advertisingDto;

    let status: BannerStatus;
    let milliseconds: number;

    if (Number(new Date(durationStart)) > Date.now()) {
      status = BannerStatus.pending;

      milliseconds = Number(new Date(durationStart)) - Date.now();
    } else if (Number(new Date(durationStart)) <= Date.now()) {
      status = BannerStatus.active;

      milliseconds = Number(new Date(durationEnd)) - Date.now();
    } else if (Number(new Date(durationEnd)) <= Date.now()) {
      status = BannerStatus.expired;
    }

    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        title,
        durationStart: new Date(durationStart),
        durationEnd: new Date(durationEnd),
        status,
        adminApprove: false,
      },
    });

    this.bookAdQueue.add(
      {
        id: banner.id,
        durationEnd: Number(new Date(banner.durationEnd)),
        status: banner.status,
      },
      { delay: milliseconds },
    );

    const result: any = {
      ...banner,
      bookId: Number(banner.bookId),
    };

    return result;
  }

  async remove(id: number): Promise<BannerModel> {
    return await this.prisma.banner.delete({
      where: {
        id,
      },
    });
  }
}
