import { PrismaClient, ViewerAccount } from '@prisma/client';

const prisma = new PrismaClient();

async function createViewer(): Promise<ViewerAccount> {
  return prisma.viewerAccount.create({
    data: {
      viewerName: 'viewer1',
      fullName: 'viewer test',
      provider: 'email',
      email: 'viewer1@gmail.com',
      password: 'viewer11',
      registerType: 'web',
    },
  });
}

export { createViewer };
