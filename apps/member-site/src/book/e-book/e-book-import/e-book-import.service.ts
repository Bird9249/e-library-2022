import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ImportHistory as ImportHistoryModel, Prisma } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from '../../../prisma/prisma.service';
import { BookValidationService } from '../../book-validation/book-validation.service';
import { CreateEBookImportDto } from './dto/create-e-book-import.dto';
import { FileFormet } from 'apps/member-site/src/common/enum/enum';
import { ImportFilesDto } from '../../dto/import-files.dto';
import { QueryBookImportDto } from '../../dto/query-book-import.dto';
import { ConfigService } from '@nestjs/config';
import { BookQueryDto } from '../../dto/book-query.dto';

@Injectable()
export class EBookImportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookValidate: BookValidationService,
    @InjectQueue('e-book') private readonly eBookQueue: Queue,
    private readonly config: ConfigService,
  ) {}

  async create(
    eBookImportDto: CreateEBookImportDto,
    fileDto: ImportFilesDto,
    memberId: number,
  ) {
    const filesResult = await this.bookValidate.tranfromFile(
      fileDto.files,
      memberId,
      [FileFormet.PDF],
    );

    let job: any;

    if (filesResult.success.length > 0) {
      job = await this.eBookQueue.add({
        eBookImportDto,
        successFiles: filesResult.success,
        memberId,
      });
    }

    return {
      success: filesResult.success.length,
      failed: filesResult.failed,
      jobId: job ? job.id : null,
    };
  }

  async findAll(libraryId: number, query: QueryBookImportDto): Promise<any> {
    const { page = 1, limit = 10, startDate, endDate } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where = { AND: [] };

    where.AND.push({
      bookLibrary: {
        every: {
          library: {
            id: libraryId,
          },
          book: {
            bookType: 'ebook',
          },
        },
      },
    });

    if (startDate) {
      where.AND.push({
        dateOfImport: { gte: new Date(startDate) },
      });
    }

    if (endDate) {
      where.AND.push({
        dateOfImport: { lte: new Date(endDate) },
      });
    }

    const [items, count] = await Promise.all([
      this.prisma.importHistory.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          dateOfImport: true,
          _count: {
            select: {
              bookLibrary: true,
            },
          },
        },
      }),
      this.prisma.importHistory.count({ where }),
    ]);

    return {
      histories: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findOne(id: number, query: BookQueryDto): Promise<any> {
    const { page = 1, limit = 10, title } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const impHis = await this.prisma.importHistory.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        dateOfImport: true,
        _count: {
          select: {
            bookLibrary: true,
          },
        },
      },
    });

    const where: Prisma.BookWhereInput = {
      AND: [
        {
          bookLibrary: { importHistoryId: id },
        },
        title ? { title: { contains: title } } : undefined,
      ],
    };

    const books = await this.prisma.book.findMany({
      where,
      select: {
        id: true,
        title: true,
        coverUrl: true,
        bookUploadedTotal: {
          select: {
            complete: true,
          },
        },
      },
      take,
      skip,
    });
    const booktotal = await this.prisma.book.count({ where });

    const result = books.map((book) => {
      return {
        ...book,
        id: Number(book.id),
        coverUrl: book.coverUrl
          ? this.config.get<string>('MEMBER_BASE_URL') + book.coverUrl
          : book.coverUrl,
      };
    });

    return {
      importHistory: impHis,
      books: {
        books: result,
        count: booktotal,
        pageCount: Math.ceil(booktotal / limit),
      },
    };
  }

  async remove(id: number): Promise<ImportHistoryModel> {
    return await this.prisma.importHistory.delete({ where: { id: id } });
  }
}
