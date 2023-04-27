import { BannerStatus } from '@prisma/client';

interface AdvertisingJob {
  id: number;
  durationEnd: number;
  status: BannerStatus;
}

export { AdvertisingJob };
