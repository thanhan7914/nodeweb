import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendMailService {
  constructor(private readonly mailerService: MailerService) {}
}
