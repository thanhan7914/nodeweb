import { Repository, Brackets, WhereExpression, SelectQueryBuilder, OrderByCondition } from 'typeorm';
import { isFunction, isString } from '@nestjs/common/utils/shared.utils';
import { FilterDto } from './filter.dto';
import { METADATA_FILTERCOLUMN, METADATA_ORDERCOLUMN, METADATA_WITHCOLUMN } from '../common.decorator';
import { WhereOption, ICriteria, wrapQuery, IOrder, Join, IFunction, JoinObject, JoinParams } from '.';
import { merge } from 'lodash';
import { PaginationInterface } from '../resource/pagination.interface';

export class Filter<T> {
    private repository: Repository<T>;
    private alias: string;
    private query: SelectQueryBuilder<T>;
    private filters: IFunction[] = [];
    private innerJoins: Join[] = [];
    private leftJoins: Join[] = [];
    private relations: string[] = [];
    private orders: Array<{[key: string]: string}> = [];

    constructor(repository: Repository<T>, alias: string) {
        this.repository = repository;
        this.alias = alias;
        this.query = this.repository.createQueryBuilder(this.alias);
    }

    private applyFilter(filterDto: FilterDto): void {
        const props: string[] = Object.getOwnPropertyNames(filterDto)
            .filter(prop => Reflect.hasMetadata(METADATA_FILTERCOLUMN, filterDto, prop));

        let value;

        for (const prop of props) {
            value = isFunction(filterDto[prop]) ? filterDto[prop]() : filterDto[prop];
            const filter: ICriteria|WhereOption = Reflect.getMetadata(METADATA_FILTERCOLUMN, filterDto, prop);

            if (! filter) {
                this.filters.push(wrapQuery((column, val) => {
                    return query => { query.andWhere(`${this.alias}.${column}=:${column}`, {[column]: val}); };
                }, prop, value));

                continue;
            }

            this.leftJoins.push(filter.leftJoin);
            this.innerJoins.push(filter.innerJoin);

            if ('filter' in filter) {
                this.filters.push(wrapQuery(v => {
                    return query => { query.andWhere(new Brackets(q => filter.filter(q, v))); };
                }, value));
            } else {
                if (! ('bindParamName' in filter)) { filter.bindParamName = filter.column ? filter.column : prop; }
                if (! ('column' in filter)) { filter.column = this.alias + '.' + prop; }
                if (! ('operator' in filter)) { filter.operator = '='; }
                if (! ('transform' in filter)) { filter.transform = r => r; }

                this.filters.push(
                    wrapQuery(
                        (v, bindParamName) => {
                            return (query) => {
                                if (filter.customQuery) {
                                    query.andWhere(
                                        new Brackets((q) => q.where(filter.customQuery, {
                                            [bindParamName]: filter.transform(v),
                                        })),
                                    );
                                } else {
                                    query.andWhere(`${filter.column} ${filter.operator} :${filter.bindParamName}`, {
                                        [bindParamName]: filter.transform(v),
                                    });
                                }
                            };
                        },
                        value,
                        filter.bindParamName,
                    ),
                );
            }
        }
    }

    private applyOrder(filterDto: FilterDto): void {
        const iOrder: IOrder = Reflect.getMetadata(METADATA_ORDERCOLUMN, filterDto);
        if (iOrder) {
            let orders: string[] = filterDto.order ? filterDto.order.split(',') : [];
            // using default order
            if (orders.length === 0 && iOrder.defaults) { orders = iOrder.defaults; }

            if (orders) {
                if (iOrder.orderableFields) {
                    const orderableFields: string[] = Object.keys(iOrder.orderableFields);
                    orders = orders.filter(r => orderableFields
                        .includes(/^[+-]/.test(r) ? r.substring(1) : r));
                }

                let direction: string;
                let isAttachDir: boolean;

                for (let order of orders) {
                    direction = 'ASC';
                    isAttachDir = false;

                    if (/^[+-]/.test(order)) {
                        isAttachDir = true;
                        direction = order.startsWith('-') ? 'DESC' : 'ASC';
                        order = order.substring(1);
                    }

                    if (iOrder.orderableFields && iOrder.orderableFields[order]) {
                        if (iOrder.orderableFields[order].direction && ! isAttachDir) {
                            direction = iOrder.orderableFields[order].direction;
                        }

                        if (iOrder.orderableFields[order].join) {
                            // using left join for order realtion fields
                            this.leftJoins.push(iOrder.orderableFields[order].join);
                        }

                        if (iOrder.orderableFields[order].column) {
                            order = iOrder.orderableFields[order].column;
                        }
                    }

                    if (order.indexOf('.') === -1) {
                        // add alias
                        order = this.alias + '.' + order;
                    }

                    this.orders.push({
                        [order]: direction,
                    });
                }
            }
        }
    }

    private applyWith(filterDto: FilterDto): void {
        if (filterDto.with) {
            const withableFields: string[] = Reflect.getMetadata(METADATA_WITHCOLUMN, filterDto);
            let withs: string[] = filterDto.with.split(',');
            if (withableFields && withableFields.length > 0) {
                withs = withs.filter(r => withableFields.includes(r));
            }

            this.relations = Array.from(new Set(this.relations.concat(withs)));
        }
    }

    private formatJoinObject(data: string|JoinParams, alias: string): JoinObject {
        if (! isString(data)) {
            return {
                alias,
                ...data,
            };
        }

        return {
            alias,
            property: data,
        };
    }

    private applyQuery(): SelectQueryBuilder<T> {
        const order: OrderByCondition = this.orders.reduce((a, c) => merge(a, c), {}) as OrderByCondition;
        const leftJoin = this.leftJoins.filter(r => r).reduce((a, c) => merge(a, c), {});
        const innerJoin = this.innerJoins.filter(r => r).reduce((a, c) => merge(a, c), {});

        const relationKeys: string[] = [];
        let leftJoinKeys = Object.keys(leftJoin);
        let pos: number;
        // apply relations
        for (const relation of this.relations) {
            pos = relation.lastIndexOf('.');

            if (pos === -1) {
                relationKeys.push(relation);
                this.query.leftJoinAndSelect(this.alias + '.' + relation, relation);
            } else {
                relationKeys.push(relation.substring(pos + 1));
                this.query.leftJoinAndSelect(relation, relation.substring(pos + 1));
            }
        }

        let temp: JoinObject;
        for (const key of leftJoinKeys) {
            if (relationKeys.includes(key)) { continue; }
            temp = this.formatJoinObject(leftJoin[key], key);
            this.query.leftJoin(temp.property, key, temp.condition, temp.parameter);
        }

        leftJoinKeys = leftJoinKeys.concat(relationKeys);
        for (const key of Object.keys(innerJoin)) {
            if (leftJoinKeys.includes(key)) {continue; }
            temp = this.formatJoinObject(innerJoin[key], key);
            this.query.innerJoin(temp.property, key, temp.condition, temp.parameter);
        }

        for (const filter of this.filters) {
            filter(this.query);
        }

        this.query.orderBy(order);

        return this.query;
    }

    addFilter(filterDto: FilterDto): this {
        this.applyFilter(filterDto);
        this.applyOrder(filterDto);
        this.applyWith(filterDto);

        return this;
    }

    select(select: any, selectionAliasName?: string): this {
        this.query.select(select, selectionAliasName);
        return this;
    }

    addSelect(select: any, selectionAliasName?: string): this {
        this.query.addSelect(select, selectionAliasName);
        return this;
    }

    addOrderBy(sort: string, order?: 'ASC' | 'DESC'): this {
        this.orders.push({[sort]: order});
        return this;
    }

    leftJoin(join: Join): this {
        this.leftJoins.push(join);
        return this;
    }

    with(...relations): this {
        this.relations = Array.from(new Set(this.relations.concat(relations)));
        return this;
    }

    subQuery(whereFactory: (qb: WhereExpression) => any): this {
        this.filters.push(query => query.andWhere(new Brackets(whereFactory)));
        return this;
    }

    all() {
        return this.applyQuery()
            .getMany();
    }

    first() {
        return this.applyQuery()
            .getOne();
    }

    async paginate(currentPage: number = 1, perPage: number = 20): Promise<PaginationInterface<T>> {
        const [result, total] = await this.applyQuery()
            .offset((currentPage > 0 ? currentPage - 1 : 0) * perPage)
            .limit(perPage)
            .getManyAndCount();

        return {
            data: result,
            paginationMetadata: {
                total,
                currentPage,
                perPage,
                lastPage: Math.ceil(total / perPage),
            },
        };
    }

    async paginateRaw(currentPage: number = 1, perPage: number = 20): Promise<PaginationInterface<any>> {
        const total: number = await this.applyQuery().getCount();
        const entity = await this.query
            .offset((currentPage > 0 ? currentPage - 1 : 0) * perPage)
            .limit(perPage)
            .getRawMany();

        return {
            data: entity,
            paginationMetadata: {
                total,
                currentPage,
                perPage,
                lastPage: Math.ceil(total / perPage),
            },
        };
    }

    getQueryBuilder(): SelectQueryBuilder<T> {
        return this.query;
    }
}
