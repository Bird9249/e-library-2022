import {
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HelperService } from 'apps/member-site/src/common/helper/helper.service';
import { PrismaService } from 'apps/member-site/src/prisma/prisma.service';
import { Job } from 'bull';
import { AudioImportJop } from './interface/audio-import.interface';

@Processor('audio')
export class AudioConsumer {
  constructor(
    private readonly helper: HelperService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Process()
  async transcode(job: Job<AudioImportJop>) {
    let progress = 0;

    const { audioImportDto, successFiles, memberId } = job.data;

    const { categoryId, subCategoryId, sourceId, langId } = audioImportDto;

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
          bookType: 'audio',
          price: 0,
          code: file.code,
          audio: {
            create: {
              fileUrl: file.url,
              timing,
              size,
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
  onQueueProgress(job: Job<AudioImportJop>, progress: number) {
    const { successFiles } = job.data;

    const percentags = (progress / successFiles.length) * 100;

    this.eventEmitter.emit(`job.progress.audio-${job.id}`, `${percentags}%`);
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    this.eventEmitter.emit(`job.failed.audio-${job.id}`, err.message);

    job.remove();
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job) {
    this.eventEmitter.emit(`job.completed.audio-${job.id}`, job.id);

    job.remove();
  }
}
