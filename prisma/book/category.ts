import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const category = prisma.category.createMany({
  data: [
    {
      name: 'ກະສິກຳ',
    },
    {
      name: 'ກົດໝາຍ',
    },
    {
      name: 'ໂຄງການບົດຈົບຊັ້ນ',
    },
    {
      name: 'ວິທະຍາສາດ ເຕັກໂນໂລຊີ',
    },
    {
      name: 'test 1',
    },
    {
      name: 'test 2',
    },
    {
      name: 'test 3',
    },
    {
      name: 'test 4',
    },
    {
      name: 'test 5',
    },
    {
      name: 'test 6',
    },
    {
      name: 'test 7',
    },
    {
      name: 'test 8',
    },
    {
      name: 'test 9',
    },
    {
      name: 'test 10',
    },
    {
      name: 'test 11',
    },
    {
      name: 'test 12',
    },
    {
      name: 'test 13',
    },
    {
      name: 'test 14',
    },
    {
      name: 'test 15',
    },
    {
      name: 'test 16',
    },
    {
      name: 'test 17',
    },
    {
      name: 'test 18',
    },
    {
      name: 'test 19',
    },
    {
      name: 'test 20',
    },
    {
      name: 'test 21',
    },
    {
      name: 'test 22',
    },
  ],
});
export default category;
