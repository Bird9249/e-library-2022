import { Injectable } from '@nestjs/common';
import { HelperService } from 'apps/member-site/src/common/helper/helper.service';
import { PrismaService } from 'apps/member-site/src/prisma/prisma.service';
import { UploadFileService } from 'apps/member-site/src/upload-file/upload-file.service';
import { BookQueryDto } from '../../dto/book-query.dto';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilesAudioDto } from './dto/files-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AudioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: UploadFileService,
    private readonly helper: HelperService,
    private config: ConfigService,
  ) {}

  async uploadFile(files: FilesAudioDto, libraryId: number) {
    const coverUrl = await this.file.uploadFile(
      'upload/file/book/thumbnail/',
      files.cover,
    );

    const fileUrl = await this.file.uploadFile(
      'upload/file/book/book-file/',
      files.audioFile,
    );

    // update storage
    await this.helper.updateStorage(libraryId, files.audioFile, null);

    const code = await this.helper.hashFileBuffer(coverUrl);

    const timing = await this.helper.getMedaiDuration(fileUrl);

    const size = this.helper.formatSize(files.audioFile.size);

    return {
      coverUrl,
      fileUrl,
      code,
      timing,
      size,
    };
  }

  async create(
    audioDto: CreateAudioDto,
    memberId: number,
    libraryId: number,
  ): Promise<any> {
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
      audio,
    } = audioDto;

    const { description, timing, size, fileUrl } = audio;

    const book = await this.prisma.book.create({
      data: {
        categoryId,
        subCategoryId,
        langId,
        sourceId,
        coverUrl,
        title,
        price,
        bookType: 'audio',
        code,
        audio: {
          create: {
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
          bookType: 'audio',
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
        where,
        take,
        skip,
        select: {
          id: true,
          title: true,
          coverUrl: true,
          audio: {
            select: {
              timing: true,
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

  async findOne(id: number): Promise<any | undefined> {
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
        audio: {
          select: {
            timing: true,
            size: true,
            description: true,
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
      audio: {
        ...book.audio,
        fileUrl:
          this.config.get<string>('MEMBER_BASE_URL') + book.audio.fileUrl,
      },
    };

    return result;
  }

  async update(id: number, audioDto: UpdateAudioDto): Promise<any> {
    const {
      categoryId,
      subCategoryId,
      langId,
      sourceId,
      title,
      price,
      audio,
      complete,
    } = audioDto;

    let updateAudio: any = undefined;

    if (audio) {
      const { description } = audio;

      updateAudio = {
        audio: {
          update: {
            description,
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
        ...updateAudio,
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

  async remove(id: number): Promise<any> {
    const book = await this.prisma.book.delete({
      where: {
        id: id,
      },
      include: {
        audio: {
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

    // delete thumbnail

    if (book.coverUrl) {
      this.file.deleteFile(book.coverUrl);
    }

    // delete file video

    let size = 0;

    size += await this.helper.getFileSize(book.audio.fileUrl);

    this.file.deleteFile(book.audio.fileUrl);

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
