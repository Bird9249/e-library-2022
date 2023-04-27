import { SetMetadata } from '@nestjs/common';

export const LibPermission = (...args: string[]) =>
  SetMetadata('lib-permission', args);
