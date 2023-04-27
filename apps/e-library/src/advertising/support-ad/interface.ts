import { BannerStatus } from '@prisma/client';

interface SupportAdJob {
  id: number;
  durationEnd: number;
  status: BannerStatus;
}

export { SupportAdJob };
