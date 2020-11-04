import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './dto/user.entity';
import { MailerModule } from '../mailer/mailer.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), MailerModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
