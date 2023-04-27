import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { MailJob } from './interface/mail.interface';

@Processor('send-email-member')
export class MailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('send-verify-email')
  async verifyEmail(job: Job<MailJob>) {
    const { user, token } = job.data;

    const verificationUrl = `http://localhost:3001/api/auth/verify?id=${user.id}&token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'ການກວດສອບອີເມລ໌',
      template: './verification',
      context: {
        verificationUrl: verificationUrl,
      },
    });
  }

  @Process('send-reset-password')
  async resetPassword(jop: Job<MailJob>) {
    const { user, token } = jop.data;

    const url = `http://localhost:3001/api/auth/reset-password/${user.id}?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'ລືມລະຫັດຜ່ານ',
      template: './confirmation',
      context: {
        username: user.memberName,
        resetLink: url,
      },
    });
  }
}
