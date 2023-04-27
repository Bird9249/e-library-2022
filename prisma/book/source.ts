import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const source = prisma.source.createMany({
  data: [{ name: 'ຮູ່ງອາລູນ ເທັກໂນໂລຊີ' }],
});
export default source;
