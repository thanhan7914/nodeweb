import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { isTimezone } from 'src/helpers';

@ValidatorConstraint({ async: false, name: 'IsTimezone' })
export class IsTimezoneConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        return isTimezone(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `$property must be a timezone`;
    }
}

export function IsTimezone(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsTimezone',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: IsTimezoneConstraint,
        });
    };
}
