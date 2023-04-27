import { Permission, PrismaClient, RoleType } from '@prisma/client';

const prisma = new PrismaClient();

async function createPermissions(): Promise<any> {
  const data = [
    { name: 'manage-book', type: RoleType.member },
    { name: 'manage-library', type: RoleType.member },
    { name: 'manage-advertising', type: RoleType.member },
    { name: 'manage-user', type: RoleType.member },
    { name: 'manage-report', type: RoleType.member },
    { name: 'manage-book', type: RoleType.admin },
    { name: 'manage-library', type: RoleType.admin },
    { name: 'manage-advertising', type: RoleType.admin },
    { name: 'manage-user', type: RoleType.admin },
    { name: 'manage-report', type: RoleType.admin },
  ];

  return await prisma.permission.createMany({ data });
}

async function memberPermissions(): Promise<Permission[]> {
  return await prisma.permission.findMany({
    where: {
      type: RoleType.member,
    },
  });
}

async function adminPermissions(): Promise<Permission[]> {
  return await prisma.permission.findMany({
    where: {
      type: RoleType.admin,
    },
  });
}

export { createPermissions, memberPermissions, adminPermissions };
