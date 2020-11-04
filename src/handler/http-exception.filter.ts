import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnprocessableEntityException } from '@nestjs/common';
import { Request, Response } from 'express';
import { isUndefined, isString } from '@nestjs/common/utils/shared.utils';
import { head } from 'lodash';
import UnprocessableEntityWithCodeException from './exceptions/unprocessable-entity-with-code.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        let error = exception.getResponse();

        const message = this.getMessage(error);

        if (isString(error) || ('statusCode' in (error as object))) {
            error = null;
        }

        let errorCode = null;
        if (exception instanceof UnprocessableEntityWithCodeException) {
            errorCode = exception.errorCode;
        }

        response.status(status).json({
            status: false,
            statusCode: status,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
            errorCode,
        });
    }

    getMessage(exception) {
        if (isString(exception)) { return exception; }
        if (! isUndefined(exception.message)) { return exception.message; }
        if (! isUndefined(exception.error)) { return exception.error; }

        const props = Object.getOwnPropertyNames(exception);

        if (props.length > 0) {
            const error = exception[head(props)];

            if (error instanceof Array) { return head(error); }
            return error;
        }

        return null;
    }
}
