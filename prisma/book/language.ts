import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const language = prisma.language.createMany({ data: [{ language: 'ລາວ' }] });
export default language;
