import { Collection } from 'collect.js';
export interface IEloquent {
    getClassName(): string;
    fill(data: Object): this;
    forceFill(data: Object): this;
    getFillable(): string[];
    getGuarded(): string[];
    isFillable(key: string): boolean;
    isGuarded(key: string): boolean;
    setAttribute(attribute: string, value: any): boolean;
    getAttribute(attribute: string): any;
    toObject(): Object;
    toJson(): Object;
    save(): Promise<any>;
    delete(): Promise<any>;
    forceDelete(): Promise<any>;
    fresh(): Promise<this | undefined | null>;
    is(model: IEloquent): boolean;
    fireEvent(event: string): this;
    newQuery(): any;
    newInstance(data: Object | undefined): any;
    newCollection(dataset: any[]): Collection<IEloquent>;
}
