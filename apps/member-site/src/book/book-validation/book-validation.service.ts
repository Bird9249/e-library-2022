import { Injectable } from '@nestjs/common';
import * as md5 from 'md5';
import { HelperService } from '../../common/helper/helper.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileService } from '../../upload-file/upload-file.service';
import {
  FailedData,
  Result,
  SuccessData,
} from './interface/book-validation.interface';

@Injectable()
export class BookValidationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadFileService,
    private readonly helper: HelperService,
  ) {}

  async tranfromFile(
    files: Express.Multer.File[],
    memberId: number,
    mimetype: Array<string>,
  ): Promise<Result> {
    const success: Array<SuccessData> = [];
    const failed: Array<FailedData> = [];

    for (let i = 0; i < files.length; i++) {
      if (mimetype.includes(files[i].mimetype)) {
        if (await this.codeExsis(files[i].buffer)) {
          if (await this.sizeOfLibrary(memberId, files[i])) {
            const path = await this.upload.uploadFile(
              'upload/file/book/book-file/',
              files[i],
            );
            const uploadFile: SuccessData = {
              code: await md5(files[i].buffer),
              url: path,
              name: files[i].originalname,
            };

            const member = await this.prisma.memberAccount.findUnique({
              where: {
                id: memberId,
              },
            });

            await this.helper.increStorage(member.libraryId, files[i].size);

            success.push(uploadFile);
          } else {
            failed.push({
              no: i + 1,
              fileName: files[i].originalname,
              message: 'ພື້ນທີ່ບໍ່ພໍ',
            });
          }
        } else {
          failed.push({
            no: i + 1,
            fileName: files[i].originalname,
            message: 'ໄຟລ໌ນີ້ມີໃນລະບົບແລ້ວ',
          });
        }
      } else {
        failed.push({
          no: i + 1,
          fileName: files[i].originalname,
          message: 'ໄຟລ໌ບໍ່ຖືກຕ້ອງ',
        });
      }
    }

    return { success, failed };
  }

  private async codeExsis(buffer: any): Promise<boolean> {
    const code = await md5(buffer);

    const result = await this.prisma.book.findUnique({ where: { code: code } });

    if (!result) {
      return true;
    } else {
      return false;
    }
  }

  private async sizeOfLibrary(
    memberId: number,
    file: Express.Multer.File,
  ): Promise<any> {
    const member = await this.prisma.memberAccount.findUnique({
      where: { id: memberId },
      select: {
        library: {
          select: {
            id: true,
            libraryLimitStorage: true,
          },
        },
      },
    });

    const currentStorage = Number(
      member.library.libraryLimitStorage.currentStorage,
    );

    const storageLimit = Number(
      member.library.libraryLimitStorage.storageLimit,
    );

    if (currentStorage + file.size <= storageLimit) {
      return true;
    } else {
      return false;
    }
  }
}
