import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    host: process.env.APP_HOST || 'localhost',
    port: process.env.APP_PORT || 3001,
    timezone: process.env.APP_TIMEZONE || 'Asia/Tokyo',
    weburl: process.env.WEB_URL || 'localhost',
}));
