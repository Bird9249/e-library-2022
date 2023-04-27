import { PrismaClient } from '@prisma/client';
import category from './book/category';
import subCategory from './book/sub-category';
import language from './book/language';
import source from './book/source';
import publisher from './book/publisher';
import { createRoles, addPerToRole } from './account/role';
import { createPermissions } from './account/permission';
import { createLibPer } from './library/library-permission';
import { addRoleToMemner } from './account/member';
import { addRoleToAdmin } from './account/admin';
import { createViewer } from './account/viewer';
import author from './book/author';
const prisma = new PrismaClient();

async function main() {
  const categoryResult = await category;

  const subCategoryResult = await subCategory;

  const languageResult = await language;

  const sourceResult = await source;

  const publisherResult = await publisher;

  const authorResult = await author;

  const permissionsResult = await createPermissions();

  const rolesResult = await createRoles();

  const addRoleToPer = await addPerToRole();

  const libPerResult = await createLibPer();

  const memberResult = await addRoleToMemner();

  const adminResult = await addRoleToAdmin();

  const viewerResult = await createViewer();

  console.log({
    categoryResult,
    subCategoryResult,
    languageResult,
    sourceResult,
    publisherResult,
    authorResult,
    permissionsResult,
    rolesResult,
    addRoleToPer,
    libPerResult,
    memberResult,
    adminResult,
    viewerResult,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
