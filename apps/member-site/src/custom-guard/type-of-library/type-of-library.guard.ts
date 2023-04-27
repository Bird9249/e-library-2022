import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LibraryType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TypeOfLibraryGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    const member = await this.prisma.memberAccount.findUnique({
      where: { id: userId },
      select: {
        library: {
          select: {
            type: true,
          },
        },
      },
    });

    if (member.library.type === LibraryType.organization) {
      return true;
    }

    return false;
  }
}
