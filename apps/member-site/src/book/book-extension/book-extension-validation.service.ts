import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FileFormet } from '../../common/enum/enum';
import { HelperService } from '../../common/helper/helper.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookExtenSionValidationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
  ) {}

  thumbnailFile(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('cover ບໍ່ຄວນວ່າງເປົ່າ', HttpStatus.BAD_REQUEST);
    }

    if (file.mimetype !== FileFormet.PNG && file.mimetype !== FileFormet.JPG) {
      throw new HttpException('ປະເພດໄຟລ໌ບໍ່ຖືກຕ້ອງ', HttpStatus.BAD_REQUEST);
    }

    return;
  }

  file(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('ໄຟລ໌ບໍ່ຄວນວ່າງເປົ່າ', HttpStatus.BAD_REQUEST);
    }

    if (file.mimetype !== FileFormet.PDF) {
      throw new HttpException('ປະເພດໄຟລ໌ບໍ່ຖືກຕ້ອງ', HttpStatus.BAD_REQUEST);
    }

    return;
  }

  async contentsStorage(
    bookId: number,
    libraryId: number,
    newFile: Express.Multer.File,
  ) {
    let sizeOfOldFile = 0;

    if (bookId) {
      const oldFile = await this.prisma.bookPDF.findUnique({
        where: {
          bookId: bookId,
        },
      });

      if (oldFile.contentsUrl) {
        sizeOfOldFile += await this.helper.getFileSize(oldFile.contentsUrl);
      }
    }

    const storage = await this.prisma.libraryLimitStorage.findFirst({
      where: {
        library: {
          id: libraryId,
        },
      },
    });

    const currentStorage = Number(storage.currentStorage) - sizeOfOldFile;

    if (Number(storage.storageLimit) < currentStorage + newFile.size) {
      const storageRemaining = this.helper.formatSize(
        Number(storage.storageLimit) - currentStorage,
      );

      const fileSizeFinal = this.helper.formatSize(newFile.size);

      throw new HttpException(
        `ພື້ນທີ່ບໍ່ພໍ ພື້ນທີ່ຍັງເຫຼືອ ${storageRemaining} ຂະໜາດຂອງໄຟລ໌ ${fileSizeFinal}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async fileStorage(
    id: number,
    libraryId: number,
    newFile: Express.Multer.File,
  ) {
    const book = await this.prisma.book.findUnique({
      where: { id: id },
      select: {
        bookType: true,
      },
    });

    let oldFile;

    if (book.bookType === 'ebook') {
      oldFile = await this.prisma.bookPDF.findFirst({
        where: {
          bookId: id,
        },
      });
    } else if (book.bookType === 'audio') {
      oldFile = await this.prisma.audio.findFirst({
        where: {
          bookId: id,
        },
      });
    } else if (book.bookType === 'video') {
      oldFile = await this.prisma.video.findFirst({
        where: {
          bookId: id,
        },
      });
    }

    const sizeOfOldFile = await this.helper.getFileSize(oldFile.fileUrl);

    const storage = await this.prisma.libraryLimitStorage.findFirst({
      where: {
        library: {
          id: libraryId,
        },
      },
    });

    const currentStorage = Number(storage.currentStorage) - sizeOfOldFile;

    if (Number(storage.storageLimit) < currentStorage + newFile.size) {
      const storageRemaining = this.helper.formatSize(
        Number(storage.storageLimit) - Number(storage.currentStorage),
      );

      const fileSizeFinal = await this.helper.formatSize(newFile.size);

      throw new HttpException(
        `ພື້ນທີ່ບໍ່ພໍ ພື້ນທີ່ຍັງເຫຼືອ ${storageRemaining} ຂະໜາດຂອງໄຟລ໌ ${fileSizeFinal}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
