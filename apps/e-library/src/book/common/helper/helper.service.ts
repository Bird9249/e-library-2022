import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/e-library/src/prisma/prisma.service';

@Injectable()
export class HelperService {
  constructor(private readonly prisma: PrismaService) {}

  async convertBigIntToInt(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] == 'bigint') {
        obj[key] = Number(obj[key]);
      }
    }

    return obj;
  }

  formatSize(bytes) {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1000,
      dm = 3,
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async checkUniqueData(
    table: string,
    column: string,
    value: any,
  ): Promise<any> {
    const data: any = await this.prisma[table].findUnique({
      where: {
        [column]: value,
      },
    });

    return data;
  }

  async checkIdIsExsis(table: string, id: number): Promise<boolean> {
    const exsis: any = await this.prisma[table].findUnique({ where: { id } });

    if (!exsis) {
      return false;
    } else {
      return true;
    }
  }
}
