import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LibraryLimitStorage as LibraryLimitStorageModel } from '@prisma/client';
import * as ffprobe from 'ffprobe';
import * as md5 from 'md5';
import * as ffprobeStatic from 'ffprobe-static';
import { join } from 'path';
import { readFileSync, stat } from 'fs';

@Injectable()
export class HelperService {
  constructor(private readonly prisma: PrismaService) {}

  private publicPath = join(__dirname, '../../..', 'public') + '/';

  getFileSize(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      stat(this.publicPath + filePath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats.size);
        }
      });
    });
  }

  async updateStorage(
    libId: number,
    file?: Express.Multer.File,
    contents?: Express.Multer.File,
  ): Promise<LibraryLimitStorageModel> {
    let currentSize = 0;

    if (file) {
      currentSize += file.size;
    }

    if (contents) {
      currentSize += contents.size;
    }

    return await this.prisma.libraryLimitStorage.update({
      where: { libraryId: libId },
      data: {
        currentStorage: {
          increment: currentSize,
        },
      },
    });
  }

  async decreStorage(libId: number, size: number) {
    await this.prisma.libraryLimitStorage.update({
      where: { libraryId: libId },
      data: {
        currentStorage: {
          decrement: size,
        },
      },
    });
  }

  async increStorage(libId: number, size: number) {
    await this.prisma.libraryLimitStorage.update({
      where: {
        libraryId: libId,
      },
      data: {
        currentStorage: {
          increment: size,
        },
      },
    });
  }

  formatSize(bytes: number) {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1000,
      dm = 3,
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async getMedaiDuration(filePath: string): Promise<string> {
    const info = await ffprobe(this.publicPath + filePath, {
      path: ffprobeStatic.path,
    });

    const durationInSeconds = parseFloat(
      info.streams[info.streams.length - 1].duration,
    );
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
    const seconds = Math.floor(durationInSeconds - hours * 3600 - minutes * 60);

    const formattedDuration =
      hours > 0
        ? `${hours}:${minutes.toString().padStart(2, '0')} ຊົ່ວໂມງ`
        : `${minutes}:${seconds.toString().padStart(2, '0')} ນາທີ`;

    return formattedDuration;
  }

  async hashFileBuffer(filePath: string) {
    const buffer = readFileSync(this.publicPath + filePath);

    return await md5(buffer);
  }
}
