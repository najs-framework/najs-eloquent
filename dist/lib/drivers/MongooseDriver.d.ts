/// <reference path="../contracts/Driver.d.ts" />
/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="../model/interfaces/IModelSetting.d.ts" />
import '../wrappers/MongooseQueryBuilderWrapper';
import '../query-builders/mongodb/MongooseQueryBuilder';
import { Document, Model, Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
export declare class MongooseDriver<Record extends Object> implements Najs.Contracts.Eloquent.Driver<Record> {
    static className: string;
    protected attributes: Document & Record;
    protected queryLogGroup: string;
    protected modelName: string;
    protected mongooseModel: Model<Document & Record>;
    protected schema: SchemaDefinition;
    protected options: SchemaOptions;
    protected softDeletesSetting?: NajsEloquent.Model.ISoftDeletesSetting;
    constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting);
    getClassName(): string;
    initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: any): void;
    protected initializeModelIfNeeded(model: NajsEloquent.Model.IModel<any>): void;
    protected getMongooseSchema(model: NajsEloquent.Model.IModel<any>): Schema;
    protected createAttributesByData(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: any): void;
    protected getCollectionName(): string;
    getRecordName(): string;
    getRecord(): Record;
    setRecord(value: Document & Record): void;
    useEloquentProxy(): boolean;
    shouldBeProxied(key: string): boolean;
    proxify(type: 'get' | 'set', target: any, key: string, value?: any): any;
    hasAttribute(name: string): boolean;
    getAttribute<T>(name: string): T;
    setAttribute<T>(name: string, value: T): boolean;
    getPrimaryKeyName(): string;
    toObject(): Object;
    newQuery<T>(): NajsEloquent.Wrapper.IQueryBuilderWrapper<T>;
    delete(softDeletes: boolean): Promise<any>;
    restore(): Promise<any>;
    save(): Promise<any>;
    markModified(name: string): void;
    isNew(): boolean;
    isSoftDeleted(): boolean;
    formatAttributeName(name: string): string;
    getModelComponentName(): string | undefined;
    getModelComponentOrder(components: string[]): string[];
}
