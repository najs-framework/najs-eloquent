import { EloquentBase } from '../../../lib/v0.x/eloquent/EloquentBase';
import { Record } from './Record';
export declare abstract class EloquentTestBase<T> extends EloquentBase<Record<T>> {
    protected getReservedPropertiesList(): string[];
    abstract getClassName(): string;
    getId(): any;
    setId(value: any): void;
    newQuery(): any;
    toObject(): Object;
    toJson(): Object;
    is(model: EloquentTestBase<T>): boolean;
    fireEvent(event: string): this;
    touch(): void;
    save(): Promise<any>;
    delete(): Promise<any>;
    restore(): Promise<any>;
    forceDelete(): Promise<any>;
    fresh(): Promise<this | undefined>;
    getAttribute(name: string): any;
    setAttribute(name: string, value: any): boolean;
    protected isNativeRecord(data: Object | undefined): boolean;
    protected initializeAttributes(): void;
    protected setAttributesByObject(nativeRecord: Object): void;
    protected setAttributesByNativeRecord(nativeRecord: Record<T>): void;
}
