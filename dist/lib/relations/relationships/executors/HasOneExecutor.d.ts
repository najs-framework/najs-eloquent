import { HasOneOrManyExecutor } from './HasOneOrManyExecutor';
export declare class HasOneExecutor<T> extends HasOneOrManyExecutor<T> {
    executeQuery(): Promise<T | undefined | null>;
    executeCollector(): T | undefined | null;
    getEmptyValue(): T | undefined;
}
