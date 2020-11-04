import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { User } from './dto/user.entity';
import { AppLogger } from '../../core/logger';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { UserRepository } from './user.repository';
import { passwordHash } from 'src/helpers';

@Injectable()
export class UserService {
    private logger = new AppLogger(UserService.name);

    constructor(private readonly userRepo: UserRepository) {}

    public async login(credentials: CredentialsDto): Promise<User> {
        const user = await this.userRepo.findOne({
            where: { email: credentials.email, role: credentials.role },
        });

        if (!user) {
            throw new BadRequestException(
                'Email or password incorrect.',
            );
        }

        if (user.password !== passwordHash(credentials.password)) {
            throw new BadRequestException(
                'Email or password incorrect.',
            );
        }

        if (!user.isActive) {
            throw new ForbiddenException('account_is_blocked');
        }

        user.lastLoginAt = new Date();
        await this.userRepo.save(user);

        return user;
    }
}
