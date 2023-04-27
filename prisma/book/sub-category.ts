import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subCategory = prisma.subCategory.createMany({
  data: [
    {
      categoryId: 2,
      name: 'ຂົງເຂດການປົກຄອງ ແລະ ຍຸຕິທຳ',
    },
    {
      categoryId: 2,
      name: 'ຂົງເຂດເສດຖະກິດ',
    },
    {
      categoryId: 2,
      name: 'ຂົງເຂດຕ່າງປະເທດ',
    },
    {
      categoryId: 2,
      name: 'ຂົງເຂດປ້ອງການຊາດ ປ້ອງກັນຄວາມສະຫງົບ',
    },
    {
      categoryId: 2,
      name: 'ຂົງເຂດວັດທະນະທຳ-ສັງຄົມ',
    },
    {
      categoryId: 3,
      name: 'ສະຖາບັນການທະນາຄານ',
    },
    {
      categoryId: 10,
      name: 'test 10 1',
    },
    {
      categoryId: 10,
      name: 'test 10 2',
    },
    {
      categoryId: 10,
      name: 'test 10 3',
    },
    {
      categoryId: 10,
      name: 'test 10 4',
    },
    {
      categoryId: 10,
      name: 'test 10 5',
    },
    {
      categoryId: 20,
      name: 'test 20 1',
    },
    {
      categoryId: 20,
      name: 'test 20 2',
    },
    {
      categoryId: 20,
      name: 'test 20 3',
    },
    {
      categoryId: 20,
      name: 'test 20 4',
    },
    {
      categoryId: 20,
      name: 'test 20 5',
    },
  ],
});
export default subCategory;
