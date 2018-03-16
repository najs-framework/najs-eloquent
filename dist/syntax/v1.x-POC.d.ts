import { Collection } from 'collect.js';
export declare type EloquentSpec<T> = {
    new (): any;
    first(): Promise<T>;
    get(): Promise<Collection<T>>;
};
export declare class EloquentDriver {
}
export declare class Mongoose<T extends any = {}> extends EloquentDriver {
    findById(): Promise<T>;
    get(): Promise<Collection<T>>;
}
export declare function Eloquent<T>(driver: EloquentDriver): EloquentSpec<T>;
