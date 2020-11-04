import { sign } from 'jsonwebtoken';
import { jwtConstants } from '../../../config/jwt.config';
import { User } from '../../user/dto/user.entity';
import { DeepPartial } from '../../../helpers/deep-partial';

export async function createAuthToken(user: DeepPartial<User>) {
    const { id } = user;
    const expiresIn = jwtConstants.timeout;
    const accessToken = createToken(id, expiresIn, jwtConstants.secret);
    const refreshToken = createToken(id, jwtConstants.timeout, jwtConstants.secret);
    return {
        expiresIn,
        accessToken,
        refreshToken,
        user,
    };
}

export function createToken(id, expiresIn, secret) {
    return sign({ id }, secret, {
        expiresIn,
        audience: 'localhost',
        issuer: 'pillcase',
    });
}
