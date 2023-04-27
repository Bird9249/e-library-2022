import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { MemberAccount } from '@prisma/client';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('send-email-member') private sendEmailQueue: Queue,
  ) {}

  async sendVerificationEmail(token: string, user: MemberAccount) {
    await this.sendEmailQueue.add('send-verify-email', {
      user,
      token,
    });

    return 'ກະລູນາກວດສອບອີເມວຂອງທ່ານ';
  }

  async sendResetPassword(user: MemberAccount, token: string) {
    await this.sendEmailQueue.add('send-reset-password', {
      user,
      token,
    });

    return 'ກະລູນາກວດສອບອີເມວຂອງທ່ານ';
  }
}
