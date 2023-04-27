import { Permission } from '@prisma/client';

interface PayloadLogin {
  id: number;
  username: string;
  permissions: Array<Permission>;
}

export { PayloadLogin };
