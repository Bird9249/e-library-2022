import { Injectable } from '@nestjs/common';
import { AdminAccount as AdminAccountModel, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { QueryUserDto } from './dto/query-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<AdminAccountModel | undefined> {
    try {
      return await this.prisma.adminAccount.findUnique({
        where: {
          userName: username,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<AdminAccountModel | undefined> {
    try {
      return await this.prisma.adminAccount.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(id: number, pass: string): Promise<AdminAccountModel> {
    try {
      return await this.prisma.adminAccount.update({
        data: {
          password: pass,
        },
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getProfile(id: number): Promise<any | undefined> {
    return await this.prisma.adminAccount.findUnique({
      where: { id: id },
      select: {
        id: true,
        userName: true,
        email: true,
        adminInfo: {
          select: {
            firstName: true,
            lastName: true,
            gender: true,
            phoneNumber: true,
          },
        },
        roles: {
          select: {
            role: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async findRoles() {
    return await this.prisma.role.findMany({
      where: { type: 'admin' },
      select: { id: true, name: true },
    });
  }

  async findAll(query: QueryUserDto, userId: number): Promise<any> {
    const { page = 1, limit = 10, name } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.AdminAccountWhereInput = {
      AND: [
        {
          id: { not: userId },
        },
        name
          ? {
              userName: {
                contains: name,
              },
            }
          : null,
      ],
    };

    const [admins, count] = await Promise.all([
      this.prisma.adminAccount.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          userName: true,
          email: true,
          adminInfo: {
            select: {
              gender: true,
            },
          },
        },
      }),
      this.prisma.adminAccount.count({ where }),
    ]);

    return {
      admins,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findDetail(id: number) {
    return this.prisma.adminAccount.findUnique({
      where: { id },
      select: {
        id: true,
        userName: true,
        email: true,
        adminInfo: {
          select: {
            firstName: true,
            lastName: true,
            gender: true,
            phoneNumber: true,
          },
        },
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async create(body: CreateUsersDto) {
    body.password = await hash(body.password, 10);

    const {
      userName,
      email,
      firstName,
      lastName,
      password,
      gender,
      phoneNumber,
      roleIds,
    } = body;

    const admin = await this.prisma.adminAccount.create({
      data: {
        userName,
        email,
        password,
        adminInfo: {
          create: {
            firstName,
            lastName,
            gender,
            phoneNumber,
          },
        },
        roles: {
          createMany: {
            data: roleIds.map((roleId) => ({ roleId })),
          },
        },
      },
    });

    delete admin.password;

    return admin;
  }

  async update(id: number, body: UpdateUsersDto) {
    const { firstName, lastName, gender, email, phoneNumber, roleIds } = body;

    let roles: Prisma.AdminToRoleUncheckedUpdateManyWithoutAdminAccountNestedInput;

    if (roleIds.length > 0) {
      roles = {
        deleteMany: { adminAccountId: id },
        createMany: { data: roleIds.map((roleId) => ({ roleId })) },
      };
    }

    const member = await this.prisma.adminAccount.update({
      where: { id },
      data: {
        email,
        roles,
        adminInfo: {
          update: {
            firstName,
            lastName,
            gender,
            phoneNumber,
          },
        },
      },
    });

    delete member.password;

    return member;
  }

  async delete(id: number) {
    const member = await this.prisma.adminAccount.delete({ where: { id } });

    delete member.password;

    return member;
  }
}
