import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ExsisIdPipe implements PipeTransform {
  async transform(value: any) {
    const prisma = new PrismaClient();
    const category: any = await prisma.category.findUnique({
      where: { id: Number(value) },
    });

    if (category) {
      return value;
    } else {
      throw new HttpException('ໄອດີ ບໍ່ມີໃນລະບົບ', HttpStatus.BAD_REQUEST);
    }
  }
}
