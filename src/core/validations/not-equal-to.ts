import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false, name: 'IsEqualTo' })
export class NotEqualToConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];

        return value !== relatedValue;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;

        return `$property must different ${relatedPropertyName}`;
    }
}

export function NotEqualTo(property: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'NotEqualTo',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: NotEqualToConstraint,
        });
    };
}
