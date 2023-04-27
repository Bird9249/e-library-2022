import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const author = prisma.author.createMany({
  data: [
    {
      fullName: 'test test',
      email: 'test@test.com',
      major: 'test',
      phoneNumber: '+8562099999999',
    },
  ],
});
export default author;
