/// <reference path="../contracts/Driver.d.ts" />
/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/features/IRecordManager.d.ts" />
import Model = NajsEloquent.Model.ModelInternal;
/**
 * Base class of all RecordManager, handling:
 *   - getKnownAttributes() and getDynamicAttributes() accessors
 *   - finding accessors/mutators and getters/setters of model
 */
export declare abstract class RecordManagerBase<T> implements NajsEloquent.Feature.IRecordManager<T> {
    abstract initialize(model: Model, isGuarded: boolean, data?: T | object): void;
    abstract getAttribute(model: Model, key: string): any;
    abstract setAttribute<T>(model: Model, key: string, value: T): boolean;
    abstract hasAttribute(model: Model, key: string): boolean;
    abstract getPrimaryKeyName(model: Model): string;
    abstract toObject(model: Model): object;
    abstract markModified(model: Model, keys: ArrayLike<Array<string | string[]>>): void;
    abstract isModified(model: Model, keys: ArrayLike<Array<string | string[]>>): boolean;
    abstract getModified(model: Model): string[];
    abstract isNew(model: Model): boolean;
    abstract getClassName(): string;
    protected executorFactory: NajsEloquent.Driver.IExecutorFactory;
    constructor(executorFactory: NajsEloquent.Driver.IExecutorFactory);
    getRecordExecutor(model: NajsEloquent.Model.ModelInternal<T>): NajsEloquent.Feature.IRecordExecutor;
    getFeatureName(): string;
    getRecordName(model: Model): string;
    getRecord(model: Model<T>): T;
    formatAttributeName(model: Model, name: string): string;
    getPrimaryKey(model: Model): any;
    setPrimaryKey<K>(model: Model, value: K): boolean;
    getKnownAttributes(model: Model): string[];
    getDynamicAttributes(model: Model): NajsEloquent.Feature.DynamicAttributeSetting[];
    attachPublicApi(prototype: object, bases: object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    buildKnownAttributes(prototype: object, bases: object[]): string[];
    buildDynamicAttributes(prototype: object, bases: object[]): {};
    findGettersAndSetters(dynamicAttributes: object, prototype: object): void;
    findAccessorsAndMutators(bucket: object, prototype: any): void;
    createDynamicAttributeIfNeeded(bucket: object, property: string): void;
    bindAccessorsAndMutators(prototype: object, dynamicAttributeSettings: object): void;
    makeAccessorAndMutatorDescriptor(prototype: object, name: string, settings: NajsEloquent.Feature.DynamicAttributeSetting): PropertyDescriptor | undefined;
}
