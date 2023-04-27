import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApproveLibraryDto } from './dto/create-approve-library.dto';
import { QueryCreateRequestDto } from './dto/query-create-request.dto';

@Injectable()
export class CreateRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryCreateRequestDto): Promise<any> {
    const { page = 1, limit = 10, id } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.LibraryWhereInput = {
      AND: [{ operationDate: null }, id ? { id: id } : undefined],
    };

    const [libraries, count] = await Promise.all([
      await this.prisma.library.findMany({
        where,
        select: {
          id: true,
          title: true,
        },
        take,
        skip,
      }),
      this.prisma.library.count({ where }),
    ]);

    return {
      libraries,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findLibPer(): Promise<any[]> {
    return this.prisma.libraryPermission.findMany();
  }

  async approveLibrary(
    id: number,
    body: CreateApproveLibraryDto,
  ): Promise<any> {
    const { libPerIds, storageLimit } = body;

    return await this.prisma.library.update({
      where: { id: id },
      data: {
        operationDate: new Date(),
        libraryLimitStorage: {
          update: {
            storageLimit,
          },
        },
        libraryPermissions: {
          create: libPerIds.map((libPerId) => ({
            libraryPermissionId: libPerId,
          })),
        },
      },
      select: {
        id: true,
        title: true,
      },
    });
  }
}
