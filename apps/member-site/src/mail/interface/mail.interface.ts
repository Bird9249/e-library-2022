import { MemberAccount } from '@prisma/client';

interface MailJob {
  user: MemberAccount;
  token: string;
}

export { MailJob };
