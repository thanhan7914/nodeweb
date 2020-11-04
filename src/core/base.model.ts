import { BaseEntity } from 'typeorm';
import { DeepPartial, transformResource } from 'src/helpers/deep-partial';

export abstract class BaseModel<T = any> extends BaseEntity {
    constructor(partial?: DeepPartial<T>|any, only?: string[]) {
        super();
        if (partial) {
            if (only) {
                Object.assign(this, transformResource(partial, only));
            } else {
                Object.assign(this, partial);
            }
        }
    }
}
