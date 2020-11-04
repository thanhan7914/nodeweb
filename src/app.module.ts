import { Module } from '@nestjs/common';
import { Config } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './core/validation.pipe';
import { MailerModule } from './app/mailer/mailer.module';

@Module({
    imports: [
        Config,
        DatabaseModule,
        UserModule,
        AuthModule,
        MailerModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule {}
