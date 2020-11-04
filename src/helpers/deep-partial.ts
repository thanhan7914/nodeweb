import { pickBy } from 'lodash';

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export function transformResource<T>(input: any, keys: string[]): DeepPartial<T> {
    return pickBy(input, (v, k) => keys.includes(k)) as DeepPartial<T>;
}
