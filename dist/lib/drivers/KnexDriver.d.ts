/// <reference path="../contracts/Driver.d.ts" />
import '../wrappers/KnexQueryBuilderWrapper';
import '../query-builders/KnexQueryBuilder';
import { RecordBaseDriver } from './based/RecordDriverBase';
export declare class KnexDriver extends RecordBaseDriver {
    protected tableName: string;
    protected connectionName: string;
    protected primaryKeyName: string;
    constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting);
    initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void;
    newQuery<T>(dataBucket?: NajsEloquent.Relation.IRelationDataBucket): NajsEloquent.Wrapper.IQueryBuilderWrapper<T>;
    getClassName(): string;
    shouldBeProxied(key: string): boolean;
    getRecordName(): string;
}
