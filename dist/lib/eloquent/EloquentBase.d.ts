import { IEloquent } from '../interfaces/IEloquent';
import { Collection } from 'collect.js';
import { IAutoload } from 'najs';
export declare type EloquentAccessor = {
    name: string;
    type: 'getter' | 'function';
    ref?: string;
};
export declare type EloquentMutator = {
    name: string;
    type: 'setter' | 'function';
    ref?: string;
};
export declare abstract class EloquentBase<NativeRecord extends Object = {}> implements IEloquent, IAutoload {
    protected __knownAttributeList: string[];
    protected attributes: NativeRecord;
    protected fillable?: string[];
    protected guarded?: string[];
    protected softDeletes?: boolean;
    protected timestamps?: boolean;
    protected accessors: {
        [key in string]: EloquentAccessor;
    };
    protected mutators: {
        [key in string]: EloquentMutator;
    };
    abstract getClassName(): string;
    abstract newQuery(): any;
    abstract toObject(): Object;
    abstract toJson(): Object;
    abstract is(model: any): boolean;
    abstract fireEvent(event: string): this;
    abstract save(): Promise<any>;
    abstract delete(): Promise<any>;
    abstract forceDelete(): Promise<any>;
    abstract fresh(): Promise<this | undefined | null>;
    abstract getAttribute(name: string): any;
    abstract setAttribute(name: string, value: any): boolean;
    protected abstract isNativeRecord(data: NativeRecord | Object | undefined): boolean;
    protected abstract initializeAttributes(): void;
    protected abstract setAttributesByObject(nativeRecord: Object): void;
    protected abstract setAttributesByNativeRecord(nativeRecord: NativeRecord): void;
    constructor();
    constructor(data: Object);
    constructor(data: NativeRecord);
    newInstance(): any;
    newInstance(data: Object): any;
    newInstance(data: NativeRecord): any;
    newCollection(dataset: Array<any>): Collection<IEloquent>;
    newCollection(dataset: Array<Object>): Collection<IEloquent>;
    newCollection(dataset: Array<NativeRecord>): Collection<IEloquent>;
    fill(data: Object): this;
    forceFill(data: Object): this;
    getFillable(): string[];
    getGuarded(): string[];
    isFillable(key: string): boolean;
    isGuarded(key: string): boolean;
    protected findGettersAndSetters(): void;
    protected findAccessorsAndMutators(): void;
    protected getAllValueOfAccessors(): Object;
    protected initialize(data: NativeRecord | Object | undefined): any;
    protected getReservedPropertiesList(): Array<string>;
}
