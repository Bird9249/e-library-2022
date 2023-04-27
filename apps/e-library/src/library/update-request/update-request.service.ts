import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryUpdateRequestDto } from './dto/query-update-requert.dto';

@Injectable()
export class UpdateRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryUpdateRequestDto): Promise<any> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.UpdateStorageWhereInput = {
      AND: [
        { status: 'pending' },
        search ? { library: { title: { contains: search } } } : undefined,
      ],
    };

    const [updateStorage, count] = await Promise.all([
      await this.prisma.updateStorage.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          store: true,
          library: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      this.prisma.updateStorage.count({ where }),
    ]);
    const items = updateStorage.map((data) => ({
      ...data,
      store: Number(data.store),
    }));

    return {
      updateStorage: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async approveUpdate(id: number): Promise<any> {
    const updateStorage = await this.prisma.updateStorage.update({
      where: { id: id },
      data: { status: 'approve' },
    });

    const storage = await this.prisma.libraryLimitStorage.findUnique({
      where: { libraryId: updateStorage.libraryId },
      select: {
        storageLimit: true,
      },
    });

    let sizeStorage = 0;
    sizeStorage = Number(storage.storageLimit) + Number(updateStorage.store);

    await this.prisma.libraryLimitStorage.update({
      where: {
        libraryId: updateStorage.libraryId,
      },
      data: { storageLimit: sizeStorage },
    });

    const result = {
      ...updateStorage,
      store: Number(updateStorage.store),
    };

    return result;
  }

  async rejectUpdate(id: number): Promise<any> {
    const updateStorage = await this.prisma.updateStorage.update({
      where: { id: id },
      data: { status: 'reject' },
    });

    const result = {
      ...updateStorage,
      store: Number(updateStorage.store),
    };

    return result;
  }
}
