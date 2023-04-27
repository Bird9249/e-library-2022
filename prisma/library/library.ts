import { Library, LibraryType, PrismaClient } from '@prisma/client';
import { perLibs } from './library-permission';

const prisma = new PrismaClient();

async function createLibrary(): Promise<Library> {
  return await prisma.library.create({
    data: {
      title: 'test library 1',
      type: LibraryType.organization,
      sector: 'test sector',
      operationDate: new Date(),
      libraryLimitStorage: {
        create: {
          storageLimit: 5368709120,
        },
      },
      Role: {
        connect: {
          id: 1,
        },
      },
    },
  });
}

async function addPerToLib(): Promise<Library> {
  const pers = await perLibs();
  const lib = await createLibrary();

  await pers.forEach(async (per) => {
    await prisma.libraryOnLibraryPermission.create({
      data: { libraryId: lib.id, libraryPermissionId: per.id },
    });
  });

  return lib;
}

export { createLibrary, addPerToLib };
