import 'reflect-metadata';
import { ClassType } from 'class-transformer/ClassTransformer';
import { BaseResource } from './resource/base.resource';
import { ICriteria, WhereOption, IOrder } from './filter';

export const METADATA_VALIDATION: string = 'core:validation';
export const METADATA_RESOURCE: string = 'core:resource';
export const METADATA_RESOURCENESTED: string = 'core:resourcenested';
export const METADATA_FILTERCOLUMN: string = 'core:filtercolumn';
export const METADATA_ORDERCOLUMN: string = 'core:ordercolumn';
export const METADATA_WITHCOLUMN: string = 'core:withcolumn';

export declare type ResourceType<T> = () => ClassType<BaseResource<T>>;

export function Validate() {
    return Reflect.metadata(METADATA_VALIDATION, true);
}

export function ExposeResource() {
    return Reflect.metadata(METADATA_RESOURCE, true);
}

export function ExposeNested<T>(resourceType: ClassType<BaseResource<T>>|ResourceType<T>) {
    return Reflect.metadata(METADATA_RESOURCENESTED, resourceType);
}

export function CanFilter(option?: ICriteria|WhereOption) {
    return Reflect.metadata(METADATA_FILTERCOLUMN, option);
}

export function CanOrder(option?: IOrder): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(METADATA_ORDERCOLUMN,  option, target.prototype);
    };
}

export function CanWith(withableFileds?: string[]): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(METADATA_WITHCOLUMN,  withableFileds, target.prototype);
    };
}
