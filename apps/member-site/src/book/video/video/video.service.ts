import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Book as BookModel } from '@prisma/client';
import { HelperService } from 'apps/member-site/src/common/helper/helper.service';
import { PrismaService } from 'apps/member-site/src/prisma/prisma.service';
import { UploadFileService } from 'apps/member-site/src/upload-file/upload-file.service';
import { BookQueryDto } from '../../dto/book-query.dto';
import { CreateVideoDto } from './dto/create-video.dto';
import { FilesVideoDto } from './dto/files-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: UploadFileService,
    private readonly helper: HelperService,
    private config: ConfigService,
  ) {}

  async uploadFile(files: FilesVideoDto, libraryId: number) {
    const coverUrl = await this.file.uploadFile(
      'upload/file/book/thumbnail/',
      files.cover,
    );

    const fileUrl = await this.file.uploadFile(
      'upload/file/book/book-file/',
      files.videoFile,
    );

    await this.helper.updateStorage(libraryId, files.videoFile, null);

    const code = await this.helper.hashFileBuffer(fileUrl);

    const timing = await this.helper.getMedaiDuration(fileUrl);

    const size = this.helper.formatSize(files.videoFile.size);

    return {
      coverUrl,
      fileUrl,
      code,
      timing,
      size,
    };
  }

  async create(
    videoDto: CreateVideoDto,
    memberId: number,
    libraryId: number,
  ): Promise<BookModel | any> {
    const {
      categoryId,
      subCategoryId,
      langId,
      sourceId,
      title,
      price,
      code,
      complete,
      coverUrl,
      video,
    } = videoDto;

    const { pattern, description, timing, size, fileUrl } = video;

    const book = await this.prisma.book.create({
      data: {
        categoryId,
        subCategoryId,
        langId,
        sourceId,
        coverUrl,
        title,
        price,
        bookType: 'video',
        code,
        video: {
          create: {
            pattern,
            description,
            size,
            timing,
            fileUrl,
          },
        },
        bookLibrary: {
          create: {
            adminApprove: false,
            libraryId: libraryId,
            status: 'private',
          },
        },
        bookUploadedTotal: {
          create: {
            memberId,
            complete,
            dateUpload: new Date(),
          },
        },
        rates: {
          create: {
            totalView: 0,
            totalDownload: 0,
          },
        },
      },
    });

    const result = {
      ...book,
      id: Number(book.id),
      coverUrl: book.coverUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + book.coverUrl
        : book.coverUrl,
    };

    return result;
  }

  async findAll(query: BookQueryDto, libraryId: number): Promise<any> {
    const { page = 1, limit = 10, title, catId, subCatId, complete } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where = { AND: [] };

    where.AND.push(
      ...[
        {
          bookLibrary: {
            libraryId: libraryId,
          },
        },
        {
          bookType: 'video',
        },
      ],
    );

    if (title) {
      where.AND.push({
        title: { contains: title },
      });
    }

    if (catId) {
      where.AND.push({
        categoryId: Number(catId),
      });
    }

    if (subCatId) {
      where.AND.push({
        subCategoryId: Number(subCatId),
      });
    }

    if (complete) {
      where.AND.push({
        bookUploadedTotal: {
          complete: complete == '1' ? true : false,
        },
      });
    }

    const [items, count] = await Promise.all([
      this.prisma.book.findMany({
        where: where,
        take: Number(take),
        skip: Number(skip),
        select: {
          id: true,
          title: true,
          coverUrl: true,
          video: {
            select: {
              pattern: true,
            },
          },
          bookUploadedTotal: {
            select: {
              complete: true,
            },
          },
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

  async findOne(id: number): Promise<BookModel | any | undefined> {
    const book = await this.prisma.book.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        price: true,
        coverUrl: true,
        rates: {
          select: {
            totalDownload: true,
            totalView: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
        subCategories: {
          select: {
            name: true,
          },
        },
        language: {
          select: {
            language: true,
          },
        },
        source: {
          select: {
            name: true,
          },
        },
        video: {
          select: {
            pattern: true,
            description: true,
            timing: true,
            size: true,
            fileUrl: true,
          },
        },
      },
    });

    const result: any = {
      ...book,
      id: Number(book.id),
      coverUrl: book.coverUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + book.coverUrl
        : book.coverUrl,
      video: {
        ...book.video,
        fileUrl:
          this.config.get<string>('MEMBER_BASE_URL') + book.video.fileUrl,
      },
    };

    return result;
  }

  async update(id: number, videoDto: UpdateVideoDto): Promise<BookModel | any> {
    const {
      categoryId,
      subCategoryId,
      langId,
      sourceId,
      title,
      price,
      video,
      complete,
    } = videoDto;

    let updateVideo: any = undefined;

    if (video) {
      const { description, pattern } = video;

      updateVideo = {
        video: {
          update: {
            description,
            pattern,
          },
        },
      };
    }

    const book = await this.prisma.book.update({
      where: {
        id: id,
      },
      data: {
        categoryId,
        subCategoryId,
        langId,
        sourceId,
        title,
        price,
        ...updateVideo,
        bookUploadedTotal: {
          update: {
            complete,
          },
        },
      },
    });

    const result = {
      ...book,
      id: Number(book.id),
      coverUrl: book.coverUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + book.coverUrl
        : book.coverUrl,
    };

    return result;
  }

  async remove(id: number): Promise<BookModel | any> {
    const book = await this.prisma.book.delete({
      where: {
        id: id,
      },
      include: {
        video: {
          select: {
            fileUrl: true,
          },
        },
        bookLibrary: {
          select: {
            libraryId: true,
          },
        },
      },
    });

    if (book.coverUrl) {
      this.file.deleteFile(book.coverUrl);
    }

    let size = 0;

    size += await this.helper.getFileSize(book.video.fileUrl);

    this.file.deleteFile(book.video.fileUrl);

    await this.helper.decreStorage(book.bookLibrary.libraryId, size);

    const result = {
      ...book,
      id: Number(book.id),
      coverUrl: book.coverUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + book.coverUrl
        : book.coverUrl,
    };

    return result;
  }
}
