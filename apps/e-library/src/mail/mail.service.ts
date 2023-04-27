import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { AdminAccount as AdminAccountModel } from '@prisma/client';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('send-email') private sendEmailQueue: Queue) {}

  async sendResetPassword(user: AdminAccountModel, token: string) {
    await this.sendEmailQueue.add('send-reset-password', {
      user: user,
      token: token,
    });

    return 'ກະລູນາກວດສອບອີເມວຂອງທ່ານ';
  }
}
