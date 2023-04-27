import { LibraryPermission, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createLibPer(): Promise<any> {
  return await prisma.libraryPermission.createMany({
    data: [
      { name: 'create-book' },
      { name: 'create-ebook' },
      { name: 'create-audio' },
      { name: 'create-video' },
      { name: 'advertising' },
    ],
  });
}

async function perLibs(): Promise<LibraryPermission[]> {
  return await prisma.libraryPermission.findMany();
}

export { createLibPer, perLibs };
