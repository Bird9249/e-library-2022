import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HelperService } from './helper/helper.service';

@Injectable()
export class ValidationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: HelperService,
  ) {}

  async checkStorage(
    libraryId: number,
    file?: Express.Multer.File,
    contents?: Express.Multer.File,
  ) {
    const storage = await this.prisma.libraryLimitStorage.findFirst({
      where: {
        library: {
          id: libraryId,
        },
      },
    });

    let currentStorage = Number(storage.currentStorage);

    if (file) {
      currentStorage += file.size;
    }

    if (contents) {
      currentStorage += contents.size;
    }

    if (Number(storage.storageLimit) < currentStorage) {
      const storageRemaining = await this.helper.formatSize(
        Number(storage.storageLimit) - Number(storage.currentStorage),
      );

      let fileSize = 0;

      if (file) {
        fileSize += file.size;
      }

      if (contents) {
        fileSize += contents.size;
      }

      const fileSizeFinal = await this.helper.formatSize(fileSize);

      throw new HttpException(
        `ພື້ນທີ່ບໍ່ພໍ ພື້ນທີ່ຍັງເຫຼືອ ${storageRemaining} ຂະໜາດຂອງໄຟລ໌ ${fileSizeFinal}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return;
  }
}
