import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestWithTimezone } from 'src/helpers';

export interface Response<T> {
    status: boolean;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                const ctx = context.switchToHttp();
                const request = ctx.getRequest<RequestWithTimezone>();
                ctx.getResponse()
                    .status(200);

                const output = {
                    status: true,
                    data,
                };

                if ('paginationMetadata' in request) {
                    Object.assign(output, request.paginationMetadata);
                }

                if (typeof data === 'object' && 'paginationMetadata' in data) {
                    output.data = data.data;
                    Object.assign(output, data.paginationMetadata);
                }

                return output;
            }),
        );
    }
}
