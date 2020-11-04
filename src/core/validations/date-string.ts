import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';

export interface DateStringOption {
    format?: string;
    minDate?: Date|moment.Moment|string;
    maxDate?: Date|moment.Moment|string;
}

@ValidatorConstraint({ async: false, name: 'IsEqualTo' })
export class IsDateStringConstraint implements ValidatorConstraintInterface {
    private message: string;

    validate(value: any, args: ValidationArguments) {
        const options: DateStringOption = args.constraints[0];
        const date: moment.Moment = moment(value, options.format, true);
        if (! date.isValid()) {
            this.message = `$property must be in format: ${ options.format }`;
            return false;
        }

        if (options.minDate && date.isBefore(options.minDate, 'day')) {
            this.message = `$property must be after or equal day ${ options.minDate }`;
            return false;
        }

        if (options.maxDate && date.isAfter(options.maxDate, 'day')) {
            this.message = `$property must be before or equal day ${ options.minDate }`;
            return false;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return this.message;
    }
}

export function DateString(options?: DateStringOption, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        if (! options) {
            options = { format: 'YYYY-MM-DD' } as DateStringOption;
        }

        registerDecorator({
            name: 'DateString',
            target: object.constructor,
            propertyName,
            constraints: [options],
            options: validationOptions,
            validator: IsDateStringConstraint,
        });
    };
}
