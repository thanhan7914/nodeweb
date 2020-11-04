import { registerAs } from '@nestjs/config';

export const jwtConstants = {
    secret: 'secretKey',
    timeout: 604800, // 1 week
};

export default registerAs('jwt', () => ({
    secret: 'secretKey',
    timeout: 604800, // 1 week
}));
