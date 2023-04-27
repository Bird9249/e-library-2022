import { Injectable } from '@nestjs/common';
import { Book as BookModel } from '@prisma/client';
import { FilesDto } from 'apps/member-site/src/book/e-book/e-book/dto/files.dto';
import { HelperService } from 'apps/member-site/src/common/helper/helper.service';
import { PrismaService } from 'apps/member-site/src/prisma/prisma.service';
import { UploadFileService } from 'apps/member-site/src/upload-file/upload-file.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookQueryDto } from '../../dto/book-query.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EBookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: UploadFileService,
    private readonly helper: HelperService,
    private readonly config: ConfigService,
  ) {}

  async uploadFile(files: FilesDto, libraryId: number) {
    // create thumbnail

    const coverUrl = await this.file.uploadFile(
      'upload/file/book/thumbnail/',
      files.cover,
    );

    // create content

    let contentsUrl: any;

    if (files.content) {
      contentsUrl = await this.file.uploadFile(
        'upload/file/book/contents/',
        files.content,
      );
    }

    // create book file

    const fileUrl = await this.file.uploadFile(
      'upload/file/book/book-file/',
      files.bookFile,
    );

    // update storage

    await this.helper.updateStorage(libraryId, files.bookFile, files.content);

    const code = await this.helper.hashFileBuffer(fileUrl);

    return {
      coverUrl,
      contentsUrl,
      fileUrl,
      code,
    };
  }

  async create(
    bookDto: CreateBookDto,
    memberId: number,
    libraryId: number,
  ): Promise<BookModel | any> {
    const {
      categoryId,
      subCategoryId,
      langId,
      sourceId,
      coverUrl,
      title,
      price,
      book,
      complete,
      authorIds,
      code,
    } = bookDto;

    const {
      pubId,
      bookPage,
      manufactureDate,
      ISBN,
      briefContent,
      content,
      fileUrl,
      contentsUrl,
      stakeholder,
    } = book;

    // assign author

    const asignAuthor: { authorId: number }[] = [];

    authorIds.forEach((authorId) => {
      asignAuthor.push({ authorId: authorId });
    });

    const books = await this.prisma.book.create({
      data: {
        categoryId,
        subCategoryId,
        langId,
        sourceId,
        coverUrl,
        title,
        price,
        bookType: 'ebook',
        code,
        bookPDF: {
          create: {
            pubId,
            fileUrl,
            contentsUrl,
            bookPage,
            manufactureDate,
            ISBN,
            briefContent,
            content,
            stakeholders: {
              create: {
                ...stakeholder,
              },
            },
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
        authors: {
          create: asignAuthor,
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
      ...books,
      id: Number(books.id),
      coverUrl: books.coverUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + books.coverUrl
        : books.coverUrl,
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
          bookType: 'ebook',
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
          bookPDF: { select: { ISBN: true } },
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
    const books = await this.prisma.book.findUnique({
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
        authors: {
          select: {
            author: {
              select: {
                fullName: true,
                major: true,
                phoneNumber: true,
                email: true,
              },
            },
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
        bookPDF: {
          select: {
            bookPage: true,
            manufactureDate: true,
            ISBN: true,
            briefContent: true,
            content: true,
            contentsUrl: true,
            fileUrl: true,
            stakeholders: {
              select: {
                editor: true,
                coverDesigner: true,
                proofreader: true,
                productionCoordinator: true,
              },
            },
            publisher: {
              select: {
                name: true,
                province: true,
                district: true,
                village: true,
                no: true,
                road: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const result: any = {
      ...books,
      id: Number(books.id),
      coverUrl: books.coverUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + books.coverUrl
        : books.coverUrl,
      bookPDF: {
        contentsUrl: books.bookPDF.contentsUrl
          ? this.config.get<string>('MEMBER_BASE_URL') +
            books.bookPDF.contentsUrl
          : books.bookPDF.contentsUrl,
        fileUrl:
          this.config.get<string>('MEMBER_BASE_URL') + books.bookPDF.fileUrl,
      },
    };

    return result;
  }

  async update(id: number, bookDto: UpdateBookDto): Promise<BookModel | any> {
    const {
      categoryId,
      subCategoryId,
      langId,
      sourceId,
      title,
      price,
      complete,
      book,
    } = bookDto;

    let updateBookPDF: any = undefined;

    if (book) {
      const { pubId, bookPage, manufactureDate, ISBN, briefContent, content } =
        book;

      updateBookPDF = {
        bookPDF: {
          update: {
            pubId: pubId,
            bookPage: bookPage,
            manufactureDate: manufactureDate,
            ISBN: ISBN,
            briefContent: briefContent,
            content: content,
          },
        },
      };

      if (book.stakeholder) {
        const { editor, coverDesigner, productionCoordinator, proofreader } =
          book.stakeholder;

        updateBookPDF.bookPDF.update.stakeholders = {
          update: {
            editor: editor,
            coverDesigner: coverDesigner,
            productionCoordinator: productionCoordinator,
            proofreader: proofreader,
          },
        };
      }
    }

    const books = await this.prisma.book.update({
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
        ...updateBookPDF,
        bookUploadedTotal: {
          update: {
            complete,
          },
        },
      },
    });

    const result = {
      ...books,
      id: Number(books.id),
      coverUrl: books.coverUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + books.coverUrl
        : books.coverUrl,
    };

    return result;
  }

  async remove(id: number): Promise<BookModel | any> {
    const book = await this.prisma.book.delete({
      where: {
        id: id,
      },
      include: {
        bookPDF: {
          select: {
            fileUrl: true,
            contentsUrl: true,
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

    // delete content

    if (book.bookPDF.contentsUrl) {
      size += await this.helper.getFileSize(book.bookPDF.contentsUrl);

      this.file.deleteFile(book.bookPDF.contentsUrl);
    }

    // delete file book

    size += await this.helper.getFileSize(book.bookPDF.fileUrl);

    this.file.deleteFile(book.bookPDF.fileUrl);

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
