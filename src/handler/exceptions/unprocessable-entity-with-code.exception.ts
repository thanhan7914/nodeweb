import { UnprocessableEntityException } from '@nestjs/common';

export default class UnprocessableEntityWithCodeException extends UnprocessableEntityException {
    public errorCode: string = null;

    constructor(message: string | object | any, errorCode: string) {
        super(message, null);

        this.errorCode = errorCode;
    }
}
