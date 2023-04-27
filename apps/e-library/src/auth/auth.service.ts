import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { jwtConstants } from './constants';
import {
  AdminAccount as AdminAccountModel,
  MemberAccount as MemberAccountModel,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { compare } from 'bcrypt';
import { PayloadLogin } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    const isMatch = await compare(pass, user.password);

    if (user && isMatch) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login(user: any) {
    const admin = await this.prisma.adminAccount.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          select: {
            role: {
              select: {
                permissions: {
                  select: {
                    permission: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const permissionSet = new Set();
    const permissions = [];

    admin.roles.forEach((role) => {
      role.role.permissions.forEach((permission) => {
        const permissionName = permission.permission.name;
        if (!permissionSet.has(permissionName)) {
          permissionSet.add(permissionName);
          permissions.push(permissionName);
        }
      });
    });
    const payload: PayloadLogin = {
      id: admin.id,
      username: admin.userName,
      permissions,
    };

    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('ອີເມວ ບໍ່ມີໃນລະບົບ', HttpStatus.NOT_FOUND);
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '15m',
    });

    return await this.mailService.sendResetPassword(user, token);
  }

  async resetPassword(id: number, token: string, pass: string) {
    try {
      await this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      await this.usersService.resetPassword(id, pass);
    } catch (error) {
      throw new HttpException(
        'ໝົດເວລາປ່ຽນລະຫັດຜ່ານແລ້ວ ກະລຸນາລອງໃໝ່',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async findAdmin(
    id: number,
    username: string,
  ): Promise<AdminAccountModel | undefined> {
    return await this.prisma.adminAccount.findUnique({
      where: { id: id, userName: username },
    });
  }

  async findMember(
    id: number,
    username: string,
  ): Promise<MemberAccountModel | undefined> {
    return await this.prisma.memberAccount.findUnique({
      where: { id: id, memberName: username },
    });
  }
}
