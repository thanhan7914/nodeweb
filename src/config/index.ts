import { ConfigService } from '@nestjs/config';

export function config(key) {
    const appConfig = new ConfigService();

    return appConfig.get(key);
}
