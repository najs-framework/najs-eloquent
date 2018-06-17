/// <reference path="../contracts/Driver.d.ts" />
import '../wrappers/MongodbQueryBuilderWrapper';
import '../query-builders/mongodb/MongodbQueryBuilder';
import { Record } from '../model/Record';
import { RecordBaseDriver } from './RecordDriverBase';
import { Collection } from 'mongodb';
export declare class MongodbDriver extends RecordBaseDriver implements Najs.Contracts.Eloquent.Driver<Record> {
    protected collection: Collection;
    protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter;
    getClassName(): string;
    initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void;
    shouldBeProxied(key: string): boolean;
    getRecordName(): string;
    getPrimaryKeyName(): string;
    isNew(): boolean;
    newQuery<T>(dataBucket?: NajsEloquent.Relation.IRelationDataBucket): NajsEloquent.Wrapper.IQueryBuilderWrapper<T>;
    delete(softDeletes: boolean): Promise<any>;
    restore(): Promise<any>;
    save(fillData?: boolean): Promise<any>;
    setAttributeIfNeeded(attribute: string, value: any): void;
    getModelComponentName(): string | undefined;
    getModelComponentOrder(components: string[]): string[];
}
