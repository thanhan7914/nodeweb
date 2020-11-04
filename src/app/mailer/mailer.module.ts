import { Module } from '@nestjs/common';
import { MailerModule as BaseMailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { SendMailService } from './send-mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        BaseMailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('mail.host'),
                    port: config.get<number>('mail.port'),
                    secure: false,
                    auth: {
                        user: config.get('mail.username'),
                        pass: config.get('mail.password'),
                    },
                },
                defaults: {
                    from: config.get('mail.from'),
                },
                template: {
                    dir: __dirname + '/templates',
                    adapter: new PugAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [SendMailService],
    exports: [SendMailService],
})
export class MailerModule {}
