import {
  InjectQueue,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { BannerStatus, SupportedBanner } from '@prisma/client';
import { Job, Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { SupportAdJob } from './interface';

@Processor('support-ad')
export class SupportAdConsumer {
  constructor(
    @InjectQueue('support-ad') private readonly supportAdQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  @Process()
  async updateStatus(job: Job<SupportAdJob>): Promise<SupportedBanner> {
    const { status, durationEnd, id } = job.data;

    let updateStatus: BannerStatus;
    let milliseconds: number;
    if (status == BannerStatus.pending) {
      updateStatus = BannerStatus.active;
      milliseconds = durationEnd - Date.now();

      console.log({ de: durationEnd, mili: milliseconds });

      await this.supportAdQueue.add(
        {
          id: id,
          durationEnd: durationEnd,
          updateStatus: updateStatus,
        },
        {
          delay: milliseconds,
        },
      );
    } else if (status == BannerStatus.active) {
      updateStatus = BannerStatus.expired;
    }
    return await this.prisma.supportedBanner.update({
      where: {
        id: id,
      },
      data: {
        status: updateStatus,
      },
    });
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    console.log(err);

    job.remove();
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job) {
    job.remove();
  }
}
