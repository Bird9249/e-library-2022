import { Injectable } from '@nestjs/common';
import {
  Category as CategoryModel,
  SubCategory as SubCategoryModel,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileService } from '../../upload-file/upload-file.service';
import { HelperService } from '../../common/helper/helper.service';
import { PubilcBookDto } from './dto/public-book.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookExtensionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
    private readonly fileService: UploadFileService,
    private readonly config: ConfigService,
  ) {}

  async findCat(): Promise<CategoryModel[] | any[]> {
    return await this.prisma.category.findMany({
      select: { id: true, name: true },
    });
  }

  async findSubCat(catId: number): Promise<SubCategoryModel[] | any[]> {
    return await this.prisma.subCategory.findMany({
      where: { categoryId: catId },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createOrUpdateCover(
    bookId: number,
    file: Express.Multer.File,
  ): Promise<any> {
    const oldFile = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (oldFile.coverUrl) {
      this.fileService.deleteFile(oldFile.coverUrl);
    }

    const coverUrl = await this.fileService.uploadFile(
      'upload/file/book/thumbnail/',
      file,
    );

    const book = await this.prisma.book.update({
      where: { id: bookId },
      data: {
        coverUrl,
      },
    });

    const result = {
      ...book,
      id: Number(book.id),
      coverUrl: this.config.get<string>('MEMBER_BASE_URL') + book.coverUrl,
    };

    console.log(result);

    return result;
  }

  async createOrUpdate(
    bookId: number,
    libraryId: number,
    file: Express.Multer.File,
  ) {
    const oldFile = await this.prisma.bookPDF.findUnique({ where: { bookId } });

    if (oldFile.contentsUrl) {
      const oldSize = await this.helper.getFileSize(oldFile.contentsUrl);

      await this.helper.decreStorage(libraryId, oldSize);

      this.fileService.deleteFile(oldFile.contentsUrl);
    }

    const url = await this.fileService.uploadFile(
      'upload/file/book/contents/',
      file,
    );

    const bookPDF = await this.prisma.bookPDF.update({
      where: { bookId },
      data: { contentsUrl: url },
    });

    await this.helper.increStorage(libraryId, file.size);

    const result = {
      ...bookPDF,
      bookId: Number(bookPDF.bookId),
    };

    return result;
  }

  async deleteContents(id: number, libraryId: number) {
    const oldFile = await this.prisma.bookPDF.findUnique({
      where: { bookId: id },
    });

    const sizeOfFile = await this.helper.getFileSize(oldFile.contentsUrl);

    await this.helper.decreStorage(libraryId, sizeOfFile);

    this.fileService.deleteFile(oldFile.contentsUrl);

    const bookPDF = await this.prisma.bookPDF.update({
      where: { bookId: id },
      data: { contentsUrl: null },
    });

    const result = {
      ...bookPDF,
      bookId: Number(bookPDF.bookId),
    };

    return result;
  }

  async updateBookFile(
    id: number,
    libraryId: number,
    file: Express.Multer.File,
  ): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        bookType: true,
      },
    });

    // delete old file

    let oldFile;

    if (book.bookType === 'ebook') {
      oldFile = await this.prisma.bookPDF.findFirst({
        where: {
          bookId: book.id,
        },
      });
    } else if (book.bookType === 'audio') {
      oldFile = await this.prisma.audio.findFirst({
        where: {
          bookId: book.id,
        },
      });
    } else if (book.bookType === 'video') {
      oldFile = await this.prisma.video.findFirst({
        where: {
          bookId: book.id,
        },
      });
    }

    if (oldFile.fileUrl) {
      const sizeOfFile = await this.helper.getFileSize(oldFile.fileUrl);

      this.fileService.deleteFile(oldFile.fileUrl);

      await this.helper.decreStorage(libraryId, sizeOfFile);
    }

    // save new file

    const newFile = await this.fileService.uploadFile(
      'upload/file/book/book-file/',
      file,
    );

    let result: any;

    if (book.bookType === 'ebook') {
      result = await this.prisma.bookPDF.update({
        where: { bookId: book.id },
        data: {
          fileUrl: newFile,
        },
      });
    } else if (book.bookType === 'audio') {
      result = await this.prisma.audio.update({
        where: { bookId: book.id },
        data: {
          fileUrl: newFile,
        },
      });
    } else if (book.bookType === 'video') {
      result = await this.prisma.video.update({
        where: { bookId: book.id },
        data: {
          fileUrl: newFile,
        },
      });
    }

    await this.helper.increStorage(libraryId, file.size);

    return 'public/' + result;
  }

  async publicBook(body: PubilcBookDto) {
    const book = await this.prisma.book.update({
      where: { id: body.bookId },
      data: { bookLibrary: { update: { status: 'public' } } },
      select: {
        id: true,
        title: true,
        coverUrl: true,
        bookLibrary: { select: { status: true, adminApprove: true } },
      },
    });

    const result = {
      ...book,
      id: Number(book.id),
    };

    return result;
  }
}
