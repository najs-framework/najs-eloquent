/// <reference path="../definitions/relations/IRelationship.d.ts" />
/// <reference path="../definitions/relations/IRelationDataBucket.d.ts" />
import Model = NajsEloquent.Model.IModel;
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket;
import IRelationship = NajsEloquent.Relation.IRelationship;
import { Relationship } from './Relationship';
export declare const RelationUtilities: {
    bundleRelations(relations: IRelationship<any>[]): IRelationship<any>[];
    isLoadedInDataBucket<T>(relationship: Relationship<T>, model: Model, name: string): boolean;
    markLoadedInDataBucket<T>(relationship: Relationship<T>, model: Model, name: string): void;
    getAttributeListInDataBucket(dataBucket: IRelationDataBucket, model: Model, attribute: string): {}[];
    associateOne(model: Model, rootModel: Model, rootKeyName: string, setTargetAttributes: (model: Model) => void): void;
    flattenModels(models: (Model | CollectJs.Collection<Model> | Model[])[]): Model[];
    associateMany(models: (Model | CollectJs.Collection<Model> | Model[])[], rootModel: Model, rootKeyName: string, setTargetAttributes: (model: Model) => void): void;
    dissociateMany(models: (Model | CollectJs.Collection<Model> | Model[])[], rootModel: Model, rootKeyName: string, setTargetAttributes: (model: Model) => void): void;
};
