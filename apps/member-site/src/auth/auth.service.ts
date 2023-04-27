import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/registet.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { jwtConstants } from './constants';
import { TokenExpiredError } from 'jsonwebtoken';
import { PayloadAuth } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => UsersService))
    private users: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.users.findOne(username);

    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
      delete user.password;
      return user;
    }
    return null;
  }

  async register(body: RegisterDto): Promise<any> {
    body.password = await bcrypt.hash(body.password, 10);

    const {
      memberName,
      email,
      password,
      fullName,
      gender,
      dateOfBirth,
      address,
    } = body;

    const createdUser = await this.prisma.memberAccount.create({
      data: {
        memberName,
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
          create: {
            roleId: 1,
          },
        },
      },
    });

    const payload = {
      id: createdUser.id,
      email: createdUser.email,
    };

    const token = await this.jwt.sign(payload, {
      secret: jwtConstants.secret,
    });

    return await this.mailService.sendVerificationEmail(token, createdUser);
  }

  async sendNew(id: number) {
    const user = await this.prisma.memberAccount.findUnique({ where: { id } });

    if (!user || user.isEmailVerified) {
      return null;
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.jwt.sign(payload, {
      secret: jwtConstants.secret,
    });

    return await this.mailService.sendVerificationEmail(token, user);
  }

  async verifyEmail(token: string, id: string): Promise<any> {
    try {
      const data = await this.jwt.verify(token, {
        secret: jwtConstants.secret,
      });

      const user = await this.prisma.memberAccount.findUnique({
        where: { email: data.email },
      });

      if (!user || user.id !== Number(id) || user.isEmailVerified) {
        return null;
      }

      const updatedUser = await this.prisma.memberAccount.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });

      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException(
          'ໂທເຄັນໝົດອາຍຸແລ້ວ ກະລຸນາລອງໃໝ່',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          { message: 'ເກີດຄວາມຜິດພາດໃນການກວດສອບໂທເຄັນ ກະລຸນາລອງໃໝ່', error },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  async login(user: any) {
    const member = await this.prisma.memberAccount.findUnique({
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

    member.roles.forEach((role) => {
      role.role.permissions.forEach((permission) => {
        const permissionName = permission.permission.name;
        if (!permissionSet.has(permissionName)) {
          permissionSet.add(permissionName);
          permissions.push(permissionName);
        }
      });
    });

    const payload: PayloadAuth = {
      id: member.id,
      username: member.memberName,
      libraryId: member.libraryId,
      permissions: permissions,
    };

    return {
      access_token: await this.jwt.sign(payload),
    };
  }

  async forgetPassword(body: ForgetPasswordDto) {
    const user = await this.prisma.memberAccount.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new HttpException('ອີເມວ ບໍ່ມີໃນລະບົບ', HttpStatus.NOT_FOUND);
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwt.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '15m',
    });

    await this.mailService.sendResetPassword(user, token);

    return user;
  }
}
