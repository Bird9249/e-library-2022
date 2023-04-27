import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ImportHistory, Prisma } from '@prisma/client';
import { FileFormet } from 'apps/member-site/src/common/enum/enum';
import { PrismaService } from 'apps/member-site/src/prisma/prisma.service';
import { Queue } from 'bull';
import { BookValidationService } from '../../book-validation/book-validation.service';
import { ImportFilesDto } from '../../dto/import-files.dto';
import { QueryBookImportDto } from '../../dto/query-book-import.dto';
import { CreateAudioImportDto } from './dto/create-audio-import.dto';
import { FindOneImportAudio } from './interface/audio-import.interface';
import { ConfigService } from '@nestjs/config';
import { BookQueryDto } from '../../dto/book-query.dto';

@Injectable()
export class AudioImportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookValidate: BookValidationService,
    @InjectQueue('audio') private readonly audioQueue: Queue,
    private readonly config: ConfigService,
  ) {}

  async create(
    audioImportDto: CreateAudioImportDto,
    fileDto: ImportFilesDto,
    memberId: number,
  ) {
    const filesResult = await this.bookValidate.tranfromFile(
      fileDto.files,
      memberId,
      [FileFormet.AUDIO],
    );

    let job: any;

    if (filesResult.success.length > 0) {
      job = await this.audioQueue.add({
        audioImportDto,
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

    const where: Prisma.ImportHistoryWhereInput = {
      AND: [
        {
          bookLibrary: {
            every: {
              library: {
                id: libraryId,
              },
              book: {
                bookType: 'audio',
              },
            },
          },
        },
        startDate ? { dateOfImport: { gte: new Date(startDate) } } : undefined,
        endDate ? { dateOfImport: { lte: new Date(endDate) } } : undefined,
      ],
    };

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

  async findOne(id: number, query: BookQueryDto): Promise<FindOneImportAudio> {
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

  async remove(id: number): Promise<ImportHistory> {
    return await this.prisma.importHistory.delete({ where: { id: id } });
  }
}
