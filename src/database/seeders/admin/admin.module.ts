import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AdminSeederService } from './admin.service';
import { User } from 'src/app/user/dto/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AdminSeederService],
    exports: [AdminSeederService],
})
export class AdminSeederModule {}
