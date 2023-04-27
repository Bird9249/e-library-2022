import { BannerStatus } from '@prisma/client';

interface QueryBookAd {
  take: number;
  skip: number;
  search?: number | string;
  status?: BannerStatus;
}

export { QueryBookAd };
