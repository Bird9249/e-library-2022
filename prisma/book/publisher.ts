import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const publisher = prisma.publisher.createMany({
  data: [
    {
      name: 'test 1',
      province: 'test province',
      district: 'test district',
      village: 'test village',
      no: '987',
      road: 'test road',
      phone: '+8562098765432',
      email: 'testPub@gmail.com',
    },
  ],
});
export default publisher;
