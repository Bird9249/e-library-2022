import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BannerStatus,
  Prisma,
  SupportedBanner as SupportedBannerModel,
} from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileService } from '../../upload-file/upload-file.service';
import { CreateSupportAdDto } from './dto/create-support-ad.dto';
import { QuerySupportAdDto } from './dto/query-support-ad.dto';
import { UpdateSupportAdDto } from './dto/update-support-ad.dto';

@Injectable()
export class SupportAdService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadFileService,
    @InjectQueue('support-ad') private readonly supportAdQueue: Queue,
    private config: ConfigService,
  ) {}

  async create(
    supportAdDto: CreateSupportAdDto,
    banner: Express.Multer.File,
  ): Promise<SupportedBannerModel> {
    const { durationStart, durationEnd } = supportAdDto;
    let status: BannerStatus;
    let milliseconds: number;

    if (Number(new Date(durationStart)) > Date.now()) {
      status = BannerStatus.pending;

      milliseconds = Number(new Date(durationStart)) - Date.now();
    } else if (Number(new Date(durationStart)) <= Date.now()) {
      status = BannerStatus.active;

      milliseconds = Number(new Date(durationEnd)) - Date.now();
    } else if (Number(new Date(durationEnd)) <= Date.now()) {
      status = BannerStatus.expired;
    }

    const fileUrl = await this.upload.uploadFile(
      'upload/admin/support-ad/',
      banner,
    );

    const supportedBanner = await this.prisma.supportedBanner.create({
      data: {
        durationStart: new Date(durationStart),
        durationEnd: new Date(durationEnd),
        status,
        bannerUrl: fileUrl,
      },
    });

    await this.supportAdQueue.add(
      {
        id: supportedBanner.id,
        durationEnd: Number(new Date(supportedBanner.durationEnd)),
        status: supportedBanner.status,
      },
      {
        delay: milliseconds,
      },
    );

    const result = {
      ...supportedBanner,
      bannerUrl:
        this.config.get<string>('ADMIN_BASE_URL') + supportedBanner.bannerUrl,
    };

    return result;
  }

  async findAll(query: QuerySupportAdDto): Promise<any> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.SupportedBannerWhereInput = search
      ? { id: search }
      : undefined;

    const [items, count] = await Promise.all([
      this.prisma.supportedBanner.findMany({
        where,
        take,
        skip,
      }),
      this.prisma.supportedBanner.count({ where }),
    ]);

    const supportedBanners = items.map((banner) => ({
      ...banner,
      bannerUrl: this.config.get<string>('ADMIN_BASE_URL') + banner.bannerUrl,
    }));

    return {
      supportedBanners,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async update(
    id: number,
    supportAdDto: UpdateSupportAdDto,
  ): Promise<SupportedBannerModel> {
    const { durationStart, durationEnd } = supportAdDto;

    const banner = await this.prisma.supportedBanner.findUnique({
      where: { id },
      select: {
        status: true,
      },
    });

    if (banner.status !== BannerStatus.expired) {
      throw new HttpException('ໂຄສະນາຍັງບໍ່ໝົດອາຍຸ', HttpStatus.BAD_REQUEST);
    }

    let status: BannerStatus;
    let milliseconds: number;

    if (Number(new Date(durationStart)) > Date.now()) {
      status = BannerStatus.pending;

      milliseconds = Number(new Date(durationStart)) - Date.now();
    } else if (Number(new Date(durationStart)) <= Date.now()) {
      status = BannerStatus.active;

      milliseconds = Number(new Date(durationEnd)) - Date.now();
    } else if (Number(new Date(durationEnd)) <= Date.now()) {
      status = BannerStatus.expired;
    }

    const supportedBanner = await this.prisma.supportedBanner.update({
      where: { id },
      data: {
        durationStart: new Date(durationStart),
        durationEnd: new Date(durationEnd),
        status,
      },
    });

    await this.supportAdQueue.add(
      {
        id: supportedBanner.id,
        durationEnd: Number(new Date(durationEnd)),
        status: status,
      },
      {
        delay: milliseconds,
      },
    );

    const result = {
      ...supportedBanner,
      bannerUrl:
        this.config.get<string>('ADMIN_BASE_URL') + supportedBanner.bannerUrl,
    };

    return result;
  }

  async updateBanner(id: number, banner: Express.Multer.File): Promise<any> {
    const deleteBanner = await this.prisma.supportedBanner.findUnique({
      where: { id: id },
    });

    if (deleteBanner.status !== BannerStatus.expired) {
      throw new HttpException('ໂຄສະນາຍັງບໍ່ໝົດອາຍຸ', HttpStatus.BAD_REQUEST);
    }

    this.upload.deleteFile(deleteBanner.bannerUrl);

    const fileUrl = await this.upload.uploadFile(
      'upload/admin/support-ad/',
      banner,
    );

    const updateBanner = await this.prisma.supportedBanner.update({
      where: { id: id },
      data: {
        bannerUrl: fileUrl,
      },
    });

    const result = {
      ...updateBanner,
      bannerUrl:
        this.config.get<string>('ADMIN_BASE_URL') + updateBanner.bannerUrl,
    };

    return result;
  }

  async remove(id: number): Promise<SupportedBannerModel> {
    const banner = await this.prisma.supportedBanner.findUnique({
      where: { id: id },
    });

    if (banner.status !== BannerStatus.expired) {
      throw new HttpException('ໂຄສະນາຍັງບໍ່ໝົດອາຍຸ', HttpStatus.BAD_REQUEST);
    }

    this.upload.deleteFile(banner.bannerUrl);

    return banner;
  }
}
