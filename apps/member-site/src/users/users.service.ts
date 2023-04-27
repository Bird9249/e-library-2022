import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemberAccount as MemberAccountModel, Prisma } from '@prisma/client';
import { QueryUserDto } from './dto/query-users.dto';
import { CreateUsersDto } from './dto/create-users.dto';
import { AuthService } from '../auth/auth.service';
import { hash } from 'bcrypt';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findRoles(libraryId: number) {
    return await this.prisma.role.findMany({
      where: { type: 'member', libraryId },
      select: { id: true, name: true },
    });
  }

  async findAll(
    query: QueryUserDto,
    libraryId: number,
    userId: number,
  ): Promise<any> {
    const { page = 1, limit = 10, name } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.MemberAccountWhereInput = {
      AND: [
        {
          libraryId: libraryId,
        },
        {
          id: { not: userId },
        },
        name
          ? {
              memberName: {
                contains: name,
              },
            }
          : null,
      ],
    };

    const [items, count] = await Promise.all([
      this.prisma.memberAccount.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          memberName: true,
          email: true,
          memberInfo: {
            select: {
              gender: true,
            },
          },
        },
      }),
      this.prisma.memberAccount.count({ where }),
    ]);

    return {
      members: items,
      count,
      pageCount: Math.ceil(count / limit),
    };
  }

  async findDetail(memberId: number) {
    return this.prisma.memberAccount.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        memberName: true,
        email: true,
        isEmailVerified: true,
        memberInfo: {
          select: {
            fullName: true,
            gender: true,
            dateOfBirth: true,
            address: true,
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

  async create(body: CreateUsersDto, libraryId: number) {
    body.password = await hash(body.password, 10);

    const {
      memberName,
      email,
      fullName,
      password,
      gender,
      dateOfBirth,
      address,
      roleIds,
    } = body;

    const member = await this.prisma.memberAccount.create({
      data: {
        memberName,
        library: { connect: { id: libraryId } },
        email,
        password,
        memberInfo: {
          create: {
            fullName,
            gender,
            dateOfBirth: new Date(dateOfBirth),
            address,
          },
        },
        roles: {
          createMany: {
            data: roleIds.map((roleId) => ({ roleId })),
          },
        },
      },
    });

    await this.authService.sendNew(member.id);

    delete member.password;

    return member;
  }

  async update(id: number, body: UpdateUsersDto) {
    const { fullName, gender, address, dateOfBirth, roleIds } = body;

    let roles: Prisma.MemberToRoleUncheckedUpdateManyWithoutMemberAccountNestedInput;

    if (roleIds.length > 0) {
      roles = {
        deleteMany: { memberAccountId: id },
        createMany: { data: roleIds.map((roleId) => ({ roleId })) },
      };
    }

    const member = await this.prisma.memberAccount.update({
      where: { id },
      data: {
        roles,
        memberInfo: {
          update: {
            fullName,
            gender,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            address,
          },
        },
      },
    });

    delete member.password;

    return member;
  }

  async delete(id: number) {
    const member = await this.prisma.memberAccount.delete({ where: { id } });

    delete member.password;

    return member;
  }

  async findOne(username: string): Promise<MemberAccountModel | undefined> {
    return await this.prisma.memberAccount.findUnique({
      where: {
        memberName: username,
      },
    });
  }

  async getProfile(id: number): Promise<MemberAccountModel | undefined> {
    return await this.prisma.memberAccount.findUnique({
      where: { id: id },
      include: {
        memberInfo: {
          select: {
            fullName: true,
            gender: true,
            dateOfBirth: true,
            address: true,
          },
        },
      },
    });
  }
}
