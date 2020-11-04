export function getFunctionOf(obj: object): string[] {
    const props: string[] = Object.getOwnPropertyNames(obj);

    return props
        .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(obj)))
        .filter((r) => typeof obj[r] === 'function');
}

export function slashSqlParam(val: string): string {
    return val
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/\v/g, '\\v')
        // tslint:disable-next-line
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\%/g, '\\%')
        .replace(/\_/g, '\\_');
}
