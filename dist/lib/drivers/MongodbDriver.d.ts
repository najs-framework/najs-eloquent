/// <reference path="../contracts/Driver.d.ts" />
import { Record } from '../model/Record';
import { RecordBaseDriver } from './RecordDriverBase';
import { Collection } from 'mongodb';
export declare class MongodbDriver extends RecordBaseDriver implements Najs.Contracts.Eloquent.Driver<Record> {
    protected collection: Collection;
    protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter;
    getClassName(): string;
    initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void;
    getRecordName(): string;
    getPrimaryKeyName(): string;
    isNew(): boolean;
    getModelComponentName(): string | undefined;
    getModelComponentOrder(components: string[]): string[];
    newQuery<T>(dataBucket?: NajsEloquent.Relation.IRelationDataBucket): NajsEloquent.Wrapper.IQueryBuilderWrapper<T>;
    delete(softDeletes: boolean): Promise<any>;
    restore(): Promise<any>;
    save(): Promise<any>;
}
