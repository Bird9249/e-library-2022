import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class LibraryPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const prisma = new PrismaClient();
    const { user } = context.switchToHttp().getRequest();
    const requiredPermissions = this.reflector.getAllAndOverride<any[]>(
      'lib-permission',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const libraryOnLibraryPermission =
      await prisma.libraryOnLibraryPermission.findMany({
        where: {
          libraryId: user.libraryId,
        },
        select: {
          libraryPermission: {
            select: {
              name: true,
            },
          },
        },
      });

    const libpers = libraryOnLibraryPermission.map(
      (lop) => lop.libraryPermission.name,
    );

    return requiredPermissions.some((permission) =>
      libpers.includes(permission),
    );
  }
}
