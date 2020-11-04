import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/app/user/dto/user.entity';
import { Repository } from 'typeorm';
import { admins, IUser } from './data';

@Injectable()
export class AdminSeederService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
    ) {}

    create(): Array<Promise<User>> {
        return admins.map(async (admin: IUser) => {
            const dbAdmin = await this.usersRepo
                .findOne({ email: admin.email });

            if (dbAdmin) { return Promise.resolve(null); }

            return Promise.resolve(await this.usersRepo.save<User>(admin as User));
        });
    }
}
