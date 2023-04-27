import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MemberManageUsersGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    const roles = await this.prisma.role.findMany({
      where: {
        members: {
          some: { memberAccountId: userId },
        },
      },
      include: {
        permissions: {
          select: {
            permission: {
              select: { name: true },
            },
          },
        },
      },
    });

    const permissionSet = new Set();
    const permissions = [];

    roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        const permissionName = permission.permission.name;
        if (!permissionSet.has(permissionName)) {
          permissionSet.add(permissionName);
          permissions.push(permissionName);
        }
      });
    });

    return permissions.includes('manage-user');
  }
}
