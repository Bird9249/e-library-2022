import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';

interface SendEmailQueue {
  user: { id: number; email: string; userName: string };
  token: string;
}

@Processor('send-email')
export class MailConsumer {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Process('send-reset-password')
  async sendEmail(jop: Job<SendEmailQueue>) {
    const { user, token } = jop.data;

    const url = `${this.configService.get<string>(
      'ADMIN_URL',
    )}/reset-password/${user.id}?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'ທ່ານລືມລະຫັດຜ່ານບໍ? ປ່ຽນລະຫັດຜ່ານ',
      template: './confirmation',
      context: {
        name: user.userName,
        url,
      },
    });
  }
}
