import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendVerificationEmail(user: User, token: string) {
    const url = `${this.configService.get('BACKEND_URL')}/auth/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Welcome to ScreenTime! Confirm your Email`,
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: { name: user.name, url },
    });
  }
  async sendPasswordResetEmail(user: User, resetToken: string) {
    const resetUrl = `${this.configService.get('BACKEND_URL')}/auth/reset-password?token=${resetToken}`;
    //const redirectUrl = `http://localhost:4200/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Password Reset`,
      template: 'passwordReset',
      context: { name: user.name, resetUrl },
    });
  }
}
