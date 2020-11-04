import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    UnprocessableEntityException,
    Inject,
    Scope,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { METADATA_VALIDATION } from './common.decorator';
import { getFunctionOf } from './utils';
import 'reflect-metadata';

@Injectable({
    scope: Scope.REQUEST,
})
export class ValidationPipe implements PipeTransform<any> {
    constructor(@Inject(REQUEST) private request: Request) {}

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        // add function call before validate
        if ('prepareForValidation' in object) { await object.prepareForValidation(this.request); }
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new UnprocessableEntityException(this.parseErrors(errors));
        }

        await this.validate(object);

        // call method after validation
        if ('afterValidation' in object) { await object.afterValidation(this.request); }

        return object;
    }

    // tslint:disable-next-line:ban-types
    private toValidate(metatype: Function): boolean {
        // tslint:disable-next-line:ban-types
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private parseErrors(errors) {
        const res = {};
        errors.forEach((item) => {
            res[item.property] = _.transform(
                item.constraints,
                (result, val, key) => {
                    result.push(val);
                    return val;
                },
                [],
            );
        });

        return res;
    }

    private async validate(obj: object): Promise<void> {
        const validationFuncs = getFunctionOf(obj).filter((func) =>
            Reflect.hasMetadata(METADATA_VALIDATION, obj, func),
        );

        for (const func of validationFuncs) {
            await obj[func](this.request);
        }
    }
}
