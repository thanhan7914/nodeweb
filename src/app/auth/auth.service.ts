import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.inferface';
import { DeepPartial } from '../../helpers/deep-partial';
import { User } from '../user/dto/user.entity';
import { jwtConstants } from '../../config/jwt.config';
import { createToken } from './jwt';
import { JwtDto } from './dto/jwt.dto';
import { classToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './dto/user-token.entity';

import * as moment from 'moment';
import { dateTimeFormat } from 'src/helpers';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        @InjectRepository(UserToken)
        private readonly userTokenRepo: Repository<UserToken>,
    ) {}

    async validateUser(payload: JwtPayload, token: string): Promise<User> {
        const user: User = await this.usersRepo
            .createQueryBuilder('user')
            .innerJoin('user.tokens', 'ut')
            .where('user.id = :userId AND ut.token = :token', {
                userId: payload.id,
                token,
            })
            .getOne();

        if (!user) {
            throw new NotFoundException('user_not_found');
        }

        if (!user.isActive) {
            throw new ForbiddenException('account_is_blocked');
        }

        return user;
    }

    async createAuthToken(user: DeepPartial<User>): Promise<JwtDto> {
        const { id } = user;
        const expiresIn = jwtConstants.timeout;
        const accessToken = createToken(id, expiresIn, jwtConstants.secret);
        const refreshToken = createToken(id, jwtConstants.timeout, jwtConstants.secret);

        await this.userTokenRepo.save(
            new UserToken({
                userId: id,
                token: accessToken,
                expire: moment()
                    .add(jwtConstants.timeout, 'seconds')
                    .format(dateTimeFormat),
            }),
        );

        return {
            expiresIn,
            accessToken,
            refreshToken,
            user: classToPlain(user),
        };
    }
}
