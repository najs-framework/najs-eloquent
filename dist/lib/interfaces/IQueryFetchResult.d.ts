import { Collection } from 'collect.js';
export interface IQueryFetchResult<T = {}> {
    get(): Promise<Collection<T>>;
    all(): Promise<Collection<T>>;
    find(): Promise<T | null>;
    count(): Promise<number>;
    pluck(value: string): Promise<Object>;
    pluck(value: string, key: string): Promise<Object>;
    update(data: Object): Promise<Object>;
    delete(): Promise<Object>;
    execute(): Promise<any>;
}
