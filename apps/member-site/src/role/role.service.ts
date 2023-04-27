import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async permissions() {
    return await this.prisma.permission.findMany({
      where: {
        type: 'member',
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async create(body: CreateRoleDto, libraryId: number) {
    const { name, perIds } = body;
    const data = perIds.map((permissionId) => ({
      permissionId,
    }));

    return await this.prisma.role.create({
      data: {
        name,
        type: 'member',
        library: {
          connect: {
            id: libraryId,
          },
        },
        permissions: {
          createMany: { data },
        },
      },
      select: { id: true, name: true },
    });
  }

  async findAll(query: QueryRoleDto, libraryId: number) {
    const { page = 1, limit = 10, name } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.RoleWhereInput = {
      AND: [
        {
          type: 'member',
        },
        { libraryId },
        name
          ? {
              name: {
                contains: name,
              },
            }
          : null,
      ],
    };

    const [items, count] = await Promise.all([
      this.prisma.role.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          name: true,
        },
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      roles: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findOne(id: number) {
    return await this.prisma.role.findFirst({
      where: { id, type: 'member' },
      select: {
        id: true,
        name: true,
        _count: { select: { members: true } },
        permissions: { select: { permission: { select: { name: true } } } },
      },
    });
  }

  async update(id: number, body: UpdateRoleDto) {
    const { name, perIds } = body;

    let permissions: Prisma.RoleToPermissionUncheckedUpdateManyWithoutRoleNestedInput;

    if (perIds) {
      permissions = {
        deleteMany: { roleId: id },
        createMany: {
          data: perIds.map((permissionId) => ({
            permissionId,
          })),
        },
      };
    }

    return await this.prisma.role.update({
      where: { id },
      data: {
        name,
        permissions,
      },
      select: { id: true, name: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.role.delete({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
