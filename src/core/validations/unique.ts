import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { EntitySchema, FindConditions, getRepository, ObjectType } from 'typeorm';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

export interface UniqueValidationArguments<E> extends ValidationArguments {
    constraints: [
        ObjectType<E> | EntitySchema<E> | string,
        ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
    ];
}

@ValidatorConstraint({ async: true })
export abstract class UniqueConstraint implements ValidatorConstraintInterface {
    async validate<E>(value: any, args: UniqueValidationArguments<E>) {
        const [EntityClass] = args.constraints;
        const repo = getRepository(EntityClass);

        // If exist the `email` value in target table, return false. (unique validation error)
        const model = await repo.findOne({
            where: {
                [args.property]: value,
            },
        });

        return isUndefined(model);
    }
}

export function Unique<E>(entity: ObjectType<E> | EntitySchema<E> | string, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entity],
            validator: UniqueConstraint,
        });
    };
}
