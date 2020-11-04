import 'reflect-metadata';
import { ObjectLiteral, WhereExpression } from 'typeorm';

export declare type IFunction<TResult = any> = (...oths) => TResult;

export declare interface JoinParams {
    property: string;
    condition?: string;
    parameter?: ObjectLiteral;
}

export declare interface JoinObject extends JoinParams {
    alias: string;
}

export declare interface Join {
    [key: string]: string|JoinParams;
}

export interface IJoin {
    leftJoin?: Join;
    innerJoin?: Join;
}

export interface WhereOption extends IJoin {
    column?: string;
    transform?: IFunction;
    operator?: string;
    bindParamName?: string;
    customQuery?: string;
}

export interface ICriteria extends IJoin {
    filter(query: WhereExpression, value: any): WhereExpression;
}

export interface IOrder {
    orderableFields?: {
        [key: string]: {
            direction?: 'DESC'|'ASC',
            join?: Join,
            column?: string,
        },
    };
    defaults?: string[];
}

export function wrapQuery(query: IFunction, ...oths): IFunction {
    return query(...oths);
}

export { Filter } from './filter';
