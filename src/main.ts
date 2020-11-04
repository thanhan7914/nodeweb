import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AppLogger } from './core/logger';
import { HttpExceptionFilter } from './handler/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { EntityExceptionFilter } from './handler/entity-exception.filter';
import { timezoneMiddleware } from './middleware/timezone.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new AppLogger(),
    });
    const options = new DocumentBuilder()
        .setTitle(`${process.env.APP_NAME} API Documentation`)
        .setDescription(`${process.env.APP_NAME} API Documentation`)
        .setVersion(process.env.APP_VERSION)
        .addTag('auth')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(process.env.SWAGGER_PATH, app, document);
    const configService = app.get(ConfigService);
    app.useGlobalFilters(new HttpExceptionFilter(), new EntityExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.enableCors();
    app.use(timezoneMiddleware);
    await app.listen(configService.get('app.port'));
}

bootstrap();
