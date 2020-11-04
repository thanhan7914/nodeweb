import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { EntityColumnNotFound } from 'typeorm/error/EntityColumnNotFound';
import { FindRelationsNotFoundError } from 'typeorm/error/FindRelationsNotFoundError';

@Catch(QueryFailedError, EntityNotFoundError, EntityColumnNotFound, FindRelationsNotFoundError)
export class EntityExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const message = exception.message;
        const status = (exception instanceof EntityNotFoundError) ? 404 : 500;

        response.status(status).json({
            status: false,
            statusCode: status,
            message,
            error: null,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
