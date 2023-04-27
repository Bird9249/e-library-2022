import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BooksActionDto } from './dto/books-action.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async allCat(): Promise<any[]> {
    return await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async allSubCat(catId: number): Promise<any[]> {
    return await this.prisma.subCategory.findMany({
      where: {
        categoryId: catId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAll(query: QueryBookDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      searchName,
      categoryId,
      subCategoryId,
      bookType,
      adminApprove,
    } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.BookWhereInput = {
      AND: [
        {
          bookLibrary: {
            status: 'public',
          },
        },
        { bookType: bookType },
        adminApprove
          ? {
              bookLibrary: {
                adminApprove: adminApprove === '1' ? true : false,
              },
            }
          : null,
        searchName ? { title: { contains: searchName } } : null,
        categoryId ? { categoryId } : null,
        subCategoryId ? { subCategoryId } : null,
      ],
    };

    const [books, count] = await Promise.all([
      this.prisma.book.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          title: true,
          bookType: true,
          coverUrl: true,
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    const items = books.map((book) => ({
      ...book,
      id: Number(book.id),
      coverUrl: book.coverUrl
        ? this.config.get<string>('ADMIN_BASE_URL') + book.coverUrl
        : book.coverUrl,
    }));

    return {
      books: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<any | undefined> {
    const book = await this.prisma.book.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        price: true,
        bookType: true,
        coverUrl: true,
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        subCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        bookUploadedTotal: {
          select: {
            complete: true,
            dateUpload: true,
            memberAccount: {
              select: {
                memberName: true,
                email: true,
                library: { select: { title: true } },
              },
            },
          },
        },
        bookDelectedTotal: {
          select: {
            status: true,
            dateDeleted: true,
            reportBook: {
              select: {
                viewerAccount: {
                  select: {
                    viewerName: true,
                    fullName: true,
                  },
                },
                description: true,
              },
            },
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
        video: {
          select: {
            timing: true,
            size: true,
            description: true,
          },
        },
        audio: {
          select: {
            timing: true,
            size: true,
            description: true,
          },
        },
        source: {
          select: {
            name: true,
          },
        },
        language: {
          select: {
            language: true,
          },
        },
        authors: {
          select: {
            author: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        rates: {
          select: {
            totalDownload: true,
            totalView: true,
          },
        },
      },
    });

    const result = {
      ...book,
      id: Number(book.id),
      coverUrl: book.coverUrl
        ? this.config.get<string>('ADMIN_BASE_URL') + book.coverUrl
        : book.coverUrl,
      bookPDF: {
        ...book.bookPDF,
        contentsUrl: book.bookPDF.contentsUrl
          ? this.config.get<string>('ADMIN_BASE_URL') + book.bookPDF.contentsUrl
          : book.bookPDF.contentsUrl,
      },
    };

    return result;
  }

  async actionPublicBook(body: BooksActionDto): Promise<any> {
    const { bookId, status } = body;

    const book = await this.prisma.book.update({
      where: { id: bookId },
      data: {
        bookLibrary: {
          update: {
            adminApprove: status ? true : false,
            status: status ? 'public' : 'private',
          },
        },
      },
      select: {
        id: true,
        title: true,
        bookLibrary: { select: { adminApprove: true, status: true } },
        coverUrl: true,
      },
    });

    const result = {
      ...book,
      id: Number(book.id),
      coverUrl: book.coverUrl
        ? this.config.get<string>('ADMIN_BASE_URL') + book.coverUrl
        : book.coverUrl,
    };

    return result;
  }
}
