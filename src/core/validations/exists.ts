import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { EntitySchema, FindConditions, getRepository, ObjectType } from 'typeorm';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

export interface ExistsValidationArguments<E> extends ValidationArguments {
    constraints: [
        ObjectType<E> | EntitySchema<E> | string,
        ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
    ];
}

export interface ExistsValidtationOption {
    columnName?: string;
}

@ValidatorConstraint({ async: true })
export abstract class ExistsConstraint implements ValidatorConstraintInterface {
    async validate<E>(value: any, args: ExistsValidationArguments<E>) {
        const [EntityClass, options] = args.constraints;
        const repo = getRepository(EntityClass);
        const columnName = options ? (options as ExistsValidtationOption).columnName : args.property;

        const model = await repo.findOne({
            where: {
                [columnName]: value,
            },
        });

        return ! isUndefined(model);
    }
}

export function Exists<E>(entity: ObjectType<E> | EntitySchema<E> | string, option?: ExistsValidtationOption, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entity, option],
            validator: ExistsConstraint,
        });
    };
}
