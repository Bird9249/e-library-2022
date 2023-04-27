import {
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';
import { HelperService } from '../../../common/helper/helper.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { VideoImportJop } from './interface/video-import.interface';

@Processor('video')
export class VideoConsumer {
  constructor(
    private readonly helper: HelperService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Process()
  async transcode(job: Job<VideoImportJop>) {
    let progress = 0;

    const { videoImportDto, successFiles, memberId } = job.data;

    const { categoryId, subCategoryId, sourceId, langId } = videoImportDto;

    const importHistory = await this.prisma.importHistory.create({
      data: {
        dateOfImport: new Date(),
      },
    });

    const member = await this.prisma.memberAccount.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        libraryId: true,
      },
    });

    successFiles.forEach(async (file) => {
      const timing = await this.helper.getMedaiDuration(file.url);

      const fileSize = await this.helper.getFileSize(file.url);

      const size = this.helper.formatSize(fileSize);

      await this.prisma.book.create({
        data: {
          categoryId: Number(categoryId),
          subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
          langId: langId ? Number(langId) : undefined,
          sourceId: sourceId ? Number(sourceId) : undefined,
          title: file.name,
          bookType: 'video',
          price: 0,
          code: file.code,
          video: {
            create: {
              fileUrl: file.url,
              timing,
              size,
              pattern: null,
              description: null,
            },
          },
          bookLibrary: {
            create: {
              adminApprove: false,
              libraryId: member.libraryId,
              status: 'private',
              importHistoryId: importHistory.id,
            },
          },
          bookUploadedTotal: {
            create: {
              memberId,
              complete: false,
              dateUpload: new Date(),
            },
          },
          rates: {
            create: {
              totalView: 0,
              totalDownload: 0,
            },
          },
        },
      });

      progress += 1;
      await job.progress(progress);
    });
  }

  @OnQueueProgress()
  onQueueProgress(job: Job<VideoImportJop>, progress: number) {
    const { successFiles } = job.data;

    const percentags = (progress / successFiles.length) * 100;

    this.eventEmitter.emit(`job.progress.video-${job.id}`, `${percentags}%`);
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    this.eventEmitter.emit(`job.failed.video-${job.id}`, err.message);
    job.remove();
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job) {
    this.eventEmitter.emit(`job.completed.video-${job.id}`, job.id);

    job.remove();
  }
}
