import {
  InjectQueue,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Banner as BannerModel, BannerStatus } from '@prisma/client';
import { Job, Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { AdvertisingJob } from './interface';

@Processor('book-ad')
export class AdvertisingConsumer {
  constructor(
    @InjectQueue('book-ad') private readonly bookAdQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  @Process()
  async updateStatus(job: Job<AdvertisingJob>): Promise<BannerModel> {
    const { id, durationEnd, status } = job.data;

    let updateStatus: BannerStatus;
    let milliseconds: number;

    if (status == BannerStatus.pending) {
      updateStatus = BannerStatus.active;
      milliseconds = durationEnd - Date.now();

      await this.bookAdQueue.add(
        {
          id: id,
          durationEnd: durationEnd,
          status: status,
        },
        {
          delay: milliseconds,
        },
      );
    } else if (status == BannerStatus.active) {
      updateStatus = BannerStatus.expired;
    }

    return await this.prisma.banner.update({
      where: {
        id: id,
      },
      data: {
        status: updateStatus,
      },
    });
  }

  @OnQueueCompleted()
  handler(job: Job, result: BannerModel) {
    console.log(
      `completed: job , ${job.id}, ' -> result: ', ${result.id}, ${result.status}`,
    );
  }
}
