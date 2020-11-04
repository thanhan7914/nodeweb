import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import database from './db.config';
import app from './app.config';
import mailConfig from './mail.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [database, app, mailConfig],
            isGlobal: true,
        }),
    ],
})
export class Config {}
