/// <reference path="interfaces/IRelation.d.ts" />
/// <reference path="interfaces/IRelationDataBucket.d.ts" />
import { Model } from '../model/Model';
export declare class RelationModelBase<T> extends Model<T> implements NajsEloquent.Relation.IRelation {
    protected isRelationLoaded: boolean;
    protected relationName: string;
    getRelationName(): string;
    getRelation(): NajsEloquent.Relation.IRelationQuery;
    isLoaded(): boolean;
    lazyLoad<T>(model: Model<T>): Promise<any>;
    eagerLoad<T>(model: Model<T>): Promise<any>;
    getDataBucket(): NajsEloquent.Relation.IRelationDataBucket;
    setDataBucket(bucket: NajsEloquent.Relation.IRelationDataBucket): this;
}
