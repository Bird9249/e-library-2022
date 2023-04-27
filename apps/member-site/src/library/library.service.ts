import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateStorageStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class LibraryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadFileService,
    private readonly config: ConfigService,
  ) {}

  async create(
    createLibraryDto: CreateLibraryDto,
    memberId: number,
  ): Promise<any> {
    const { title, type, sector } = createLibraryDto;

    const lib = await this.prisma.library.create({
      data: {
        title: title,
        type: type,
        sector: sector,
        libraryLimitStorage: {
          create: {
            storageLimit: 5368709120,
            currentStorage: 0,
          },
        },
        memberAccount: {
          connect: {
            id: memberId,
          },
        },
      },
    });

    return lib;
  }

  async uploadProFile(file: Express.Multer.File, libId: number): Promise<any> {
    const oldLibrary = await this.prisma.library.findUnique({
      where: { id: libId },
    });

    if (oldLibrary.profileUrl) {
      this.upload.deleteFile(oldLibrary.profileUrl);
    }

    const fileUrl = await this.upload.uploadFile(
      'upload/file/library/profile/',
      file,
    );

    const library = await this.prisma.library.update({
      where: { id: libId },
      data: { profileUrl: fileUrl },
    });

    const result = {
      ...library,
      profileUrl: library.profileUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + library.profileUrl
        : library.profileUrl,
      backgruondUrl: library.backgroundUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + library.backgroundUrl
        : library.backgroundUrl,
    };

    return result;
  }

  async uploadBackground(
    file: Express.Multer.File,
    libId: number,
  ): Promise<any> {
    const oldLibrary = await this.prisma.library.findUnique({
      where: { id: libId },
    });

    if (oldLibrary.backgroundUrl) {
      this.upload.deleteFile(oldLibrary.backgroundUrl);
    }

    const fileUrl = await this.upload.uploadFile(
      'upload/file/library/background/',
      file,
    );

    const library = await this.prisma.library.update({
      where: { id: libId },
      data: { backgroundUrl: fileUrl },
    });

    const result = {
      ...library,
      profileUrl: library.profileUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + library.profileUrl
        : library.profileUrl,
      backgruondUrl: library.backgroundUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + library.backgroundUrl
        : library.backgroundUrl,
    };

    return result;
  }

  async detailLib(id: number): Promise<any | undefined> {
    const library = await this.prisma.library.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        sector: true,
        type: true,
        operationDate: true,
        profileUrl: true,
        backgroundUrl: true,
        libraryLimitStorage: {
          select: {
            storageLimit: true,
            currentStorage: true,
          },
        },
        memberAccount: {
          select: {
            id: true,
            memberName: true,
            memberInfo: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    const result = {
      ...library,
      profileUrl: library.profileUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + library.profileUrl
        : library.profileUrl,
      backgruondUrl: library.backgroundUrl
        ? this.config.get<string>('MEMBER_BASE_URL') + library.backgroundUrl
        : library.backgroundUrl,
      libraryLimitStorage: {
        storageLimit: Number(library.libraryLimitStorage.storageLimit),
        currentStorage: Number(library.libraryLimitStorage.currentStorage),
      },
    };

    return result;
  }

  async updateLibrary(id: number, libraryDto: UpdateLibraryDto): Promise<any> {
    return await this.prisma.library.update({
      where: {
        id: id,
      },
      data: {
        title: libraryDto.title,
        sector: libraryDto.sector,
      },
    });
  }

  async upgradeStorage(
    libId: number,
    storageDto: UpdateStorageDto,
  ): Promise<any> {
    const upgraded = await this.prisma.updateStorage.create({
      data: {
        libraryId: libId,
        store: storageDto.storage,
        status: UpdateStorageStatus.pending,
      },
      include: { library: true },
    });

    const result = {
      ...upgraded,
      store: Number(upgraded.store),
    };

    return result;
  }
}
