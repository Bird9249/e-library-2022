import { PrismaClient, Role, RoleType } from '@prisma/client';
import { adminPermissions, memberPermissions } from './permission';

const prisma = new PrismaClient();

async function createRoles(): Promise<any> {
  const data = [
    { name: 'super-admin', type: RoleType.member },
    { name: 'super-admin', type: RoleType.admin },
  ];

  return await prisma.role.createMany({ data });
}

async function addPerToRole() {
  const rolesData = await roles();
  const memberPerData = await memberPermissions();
  const adminPerData = await adminPermissions();

  rolesData.forEach(async (role) => {
    if (role.id === 1) {
      memberPerData.forEach(async (per) => {
        await prisma.roleToPermission.create({
          data: { roleId: role.id, permissionId: per.id },
        });
      });
    } else if (role.id === 2) {
      adminPerData.forEach(async (per) => {
        await prisma.roleToPermission.create({
          data: { roleId: role.id, permissionId: per.id },
        });
      });
    }
  });
}

async function memberRoles(): Promise<Role> {
  return await prisma.role.findFirst({
    where: { type: 'member' },
  });
}

async function adminRoles(): Promise<Role> {
  return await prisma.role.findFirst({
    where: { type: 'admin' },
  });
}

async function roles(): Promise<Role[]> {
  return await prisma.role.findMany();
}

export { createRoles, memberRoles, adminRoles, addPerToRole, roles };
