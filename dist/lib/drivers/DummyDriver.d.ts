/// <reference path="../contracts/Driver.d.ts" />
export declare class DummyDriver implements Najs.Contracts.Eloquent.Driver<Object> {
    static className: string;
    attributes: Object;
    getClassName(): string;
    initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void;
    getRecordName(): string;
    getRecord(): Object;
    setRecord(value: any): void;
    useEloquentProxy(): boolean;
    shouldBeProxied(key: string): boolean;
    proxify(type: 'get' | 'set', target: any, key: string, value?: any): any;
    hasAttribute(name: string): boolean;
    getAttribute<T>(name: string): T;
    setAttribute<T>(name: string, value: T): boolean;
    getPrimaryKeyName(): string;
    toObject(): Object;
    newQuery(): any;
    delete(softDeletes: boolean): Promise<boolean>;
    restore(): Promise<any>;
    save(): Promise<any>;
    isNew(): boolean;
    isSoftDeleted(): boolean;
    markModified(name: string): void;
    getModelComponentName(): string | undefined;
    getModelComponentOrder(components: string[]): string[];
    formatAttributeName(name: string): string;
}
