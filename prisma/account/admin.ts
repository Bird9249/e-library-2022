import { AdminAccount, AdminInfoGender, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { adminRoles } from '../account/role';

const prisma = new PrismaClient();

async function createAdmin(): Promise<AdminAccount> {
  const password = await hash('11111111', 10);

  return await prisma.adminAccount.create({
    data: {
      userName: 'admin1',
      email: 'admin1@gmail.com',
      password,
      adminInfo: {
        create: {
          firstName: 'admin1',
          lastName: 'test',
          gender: AdminInfoGender.male,
          phoneNumber: '+8562099999999',
        },
      },
    },
  });
}

async function addRoleToAdmin(): Promise<any> {
  const role = await adminRoles();
  const admin = await createAdmin();

  await prisma.adminToRole.create({
    data: {
      adminAccountId: admin.id,
      roleId: role.id,
    },
  });
}

export { addRoleToAdmin };
