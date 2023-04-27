import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class GetByIdPipe implements PipeTransform<number, number | any> {
  constructor(private readonly table: string) {}

  async transform(value: number): Promise<number> {
    if (!isFinite(value)) {
      throw new BadRequestException('id ຕ້ອງເປັນໂຕເລກ');
    }

    const prisma = new PrismaClient();

    const data = await prisma[this.table].findUnique({
      where: {
        id: Number(value),
      },
    });

    if (!data) {
      throw new BadRequestException('id ບໍ່ມີໃນລະບົບ');
    }

    return Number(value);
  }
}
