import { MemberAccount, MemberInfoGender, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { addPerToLib } from '../library/library';
import { memberRoles } from './role';

const prisma = new PrismaClient();

async function createMember(): Promise<MemberAccount> {
  const lib = await addPerToLib();
  const password = await hash('member11', 10);

  return await prisma.memberAccount.create({
    data: {
      libraryId: lib.id,
      memberName: 'member1',
      email: 'member1@gmail.com',
      password,
      memberInfo: {
        create: {
          fullName: 'test member1',
          gender: MemberInfoGender.male,
          dateOfBirth: new Date(),
          address: 'test address',
        },
      },
    },
  });
}

async function addRoleToMemner(): Promise<any> {
  const member = await createMember();
  const role = await memberRoles();

  await prisma.memberToRole.create({
    data: { memberAccountId: member.id, roleId: role.id },
  });
}

export { createMember, addRoleToMemner };
