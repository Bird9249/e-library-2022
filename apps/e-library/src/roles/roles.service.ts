import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async permissions() {
    return await this.prisma.permission.findMany({
      where: {
        type: 'admin',
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async create(body: CreateRoleDto) {
    const { name, perIds } = body;

    return await this.prisma.role.create({
      data: {
        name,
        type: 'admin',
        permissions: {
          createMany: {
            data: perIds.map((permissionId) => ({
              permissionId,
            })),
          },
        },
      },
      select: { id: true, name: true },
    });
  }

  async findAll(query: QueryRoleDto) {
    const { page = 1, limit = 10, name } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.RoleWhereInput = {
      AND: [
        {
          type: 'admin',
        },
        name
          ? {
              name: {
                contains: name,
              },
            }
          : null,
      ],
    };

    const [roles, count] = await Promise.all([
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
      roles,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findOne(id: number) {
    return await this.prisma.role.findFirst({
      where: { id, type: 'admin' },
      select: {
        id: true,
        name: true,
        _count: { select: { admins: true } },
        permissions: { select: { permission: { select: { name: true } } } },
      },
    });
  }

  async update(id: number, body: UpdateRoleDto) {
    const { name, perIds } = body;

    const permissions: Prisma.RoleToPermissionUncheckedUpdateManyWithoutRoleNestedInput =
      perIds
        ? {
            deleteMany: { roleId: id },
            createMany: {
              data: perIds.map((permissionId) => ({
                permissionId,
              })),
            },
          }
        : undefined;

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
