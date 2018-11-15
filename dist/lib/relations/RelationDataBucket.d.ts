/// <reference path="../definitions/relations/IRelationDataBucket.d.ts" />
/// <reference path="../../../lib/definitions/collect.js/index.d.ts" />
import Model = NajsEloquent.Model.IModel;
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket;
import IRelationDataBucketMetadata = NajsEloquent.Relation.IRelationDataBucketMetadata;
import Autoload = Najs.Contracts.Autoload;
import { DataBuffer } from '../data/DataBuffer';
export declare class RelationDataBucket implements Autoload, IRelationDataBucket {
    protected bucket: {
        [key in string]: {
            data: DataBuffer<object>;
            meta: {
                loaded: string[];
            };
        };
    };
    constructor();
    getClassName(): string;
    add(model: Model): this;
    makeModel<M extends Model = Model>(model: M, data: any): M;
    makeCollection<M extends Model = Model>(model: M, data: any[]): CollectJs.Collection<M>;
    getDataOf<M extends Model = Model>(model: M): DataBuffer<object>;
    getMetadataOf(model: Model): IRelationDataBucketMetadata;
    createKey(model: Model): string;
}
