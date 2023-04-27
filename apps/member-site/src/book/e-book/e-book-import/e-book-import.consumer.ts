import {
  Processor,
  Process,
  OnQueueProgress,
  OnQueueFailed,
  OnQueueCompleted,
} from '@nestjs/bull';
import { PrismaService } from '../../../prisma/prisma.service';
import { Job } from 'bull';
import { EBookImportJop } from './interface/e-book-import.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('e-book')
export class EBookConsumer {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Process()
  async transcode(job: Job<EBookImportJop>) {
    let progress = 0;

    const { eBookImportDto, successFiles, memberId } = job.data;

    const { categoryId, subCategoryId, sourceId, langId, pubId } =
      eBookImportDto;

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
      await this.prisma.book.create({
        data: {
          categoryId: Number(categoryId),
          subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
          langId: langId ? Number(langId) : undefined,
          sourceId: sourceId ? Number(sourceId) : undefined,
          title: file.name,
          bookType: 'ebook',
          price: 0,
          code: file.code,
          bookPDF: {
            create: {
              pubId: pubId ? Number(pubId) : undefined,
              manufactureDate: null,
              briefContent: null,
              content: null,
              ISBN: null,
              fileUrl: file.url,
              stakeholders: {
                create: {
                  editor: null,
                  coverDesigner: null,
                  productionCoordinator: null,
                  proofreader: null,
                },
              },
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
  onQueueProgress(job: Job<EBookImportJop>, progress: number) {
    const { successFiles } = job.data;

    const percentags = (progress / successFiles.length) * 100;

    this.eventEmitter.emit(`job.progress.e-book-${job.id}`, `${percentags}%`);
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    this.eventEmitter.emit(`job.failed.e-book-${job.id}`, err.message);
    job.remove();
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job) {
    this.eventEmitter.emit(`job.completed.e-book-${job.id}`, job.id);
    job.remove();
  }
}
