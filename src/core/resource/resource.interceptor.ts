import 'reflect-metadata';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassType } from 'class-transformer/ClassTransformer';
import { BaseResource } from './base.resource';
import { DeepPartial } from 'src/helpers/deep-partial';
import { METADATA_RESOURCE, METADATA_RESOURCENESTED } from '../common.decorator';
import { getFunctionOf } from '../utils';
import { isFunction, isObject } from '@nestjs/common/utils/shared.utils';
import { RequestWithTimezone } from 'src/helpers';
import { PaginationInterface } from './pagination.interface';

function transform<T>(classType: ClassType<BaseResource<T>>, data: object|object[], request: Request): DeepPartial<T> {
    if (data instanceof Array) {
        return data.map(r => transform<T>(classType, r, request));
    }

    const resource: BaseResource<T> = new classType(data, request);
    const props: string[] = Object.keys(data).concat(getFunctionOf(resource));
    const container: DeepPartial<T> = {} as DeepPartial<T>;

    for (const prop of props) {
        if (Reflect.hasMetadata(METADATA_RESOURCE, resource, prop)) {
            container[prop] = isFunction(resource[prop]) ? resource[prop]() : data[prop];
        }

        if (Reflect.hasMetadata(METADATA_RESOURCENESTED, resource, prop)) {
            const value = isFunction(resource[prop]) ? resource[prop]() : data[prop];

            if (value) {
                const resourceType = Reflect.getMetadata(METADATA_RESOURCENESTED, resource, prop);

                container[prop] = transform(
                    resourceType.name ? resourceType : resourceType(),
                    value,
                    request,
                );
            }
        }
    }

    return container;
}

@Injectable()
export class ResourceInterceptor<T> implements NestInterceptor<BaseResource<T>, DeepPartial<T>> {
    classType: ClassType<BaseResource<T>>;

    constructor(classType: ClassType<BaseResource<T>>) {
        this.classType = classType;
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<DeepPartial<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<RequestWithTimezone>();

        return next.handle().pipe(map(data => {
            if (isObject(data)) {
                if ('paginationMetadata' in data) {
                    Object.assign(request, {
                        paginationMetadata: (data as PaginationInterface<T>).paginationMetadata,
                    });

                    return transform(this.classType, (data as PaginationInterface<T>).data, request);
                }

                return transform(this.classType, data, request);
            }

            return data;
        }));
    }
}
