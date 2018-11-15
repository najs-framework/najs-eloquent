/// <reference path="../definitions/data/IDataReader.d.ts" />
/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/features/IRelationFeature.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import IRelation = NajsEloquent.Relation.IRelationship;
import IRelationshipFactory = NajsEloquent.Relation.IRelationshipFactory;
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket;
import IRelationData = NajsEloquent.Relation.IRelationData;
import RelationDefinitions = NajsEloquent.Relation.RelationDefinitions;
import { FeatureBase } from './FeatureBase';
export declare class RelationFeature extends FeatureBase implements NajsEloquent.Feature.IRelationFeature {
    getPublicApi(): object;
    getFeatureName(): string;
    getClassName(): string;
    makeDataBucket(model: IModel): IRelationDataBucket;
    makeFactory(model: IModel, accessor: string): IRelationshipFactory;
    getDataBucket(model: NajsEloquent.Model.IModel): IRelationDataBucket | undefined;
    setDataBucket(model: NajsEloquent.Model.IModel, dataBucket: IRelationDataBucket): void;
    createKeyForDataBucket(model: NajsEloquent.Model.IModel): string;
    getDataReaderForDataBucket(): NajsEloquent.Data.IDataReader<any>;
    getRawDataForDataBucket<R>(model: NajsEloquent.Model.IModel): R;
    getEmptyValueForRelationshipForeignKey(model: NajsEloquent.Model.IModel, key: string): any;
    getEmptyValueForSerializedRelation(model: NajsEloquent.Model.IModel, key: string): any;
    getDefinitions(model: IModel): RelationDefinitions;
    buildDefinitions(model: IModel, prototype: object, bases: object[]): RelationDefinitions;
    findByName<T = {}>(model: IModel, name: string): IRelation<T>;
    findDataByName<T>(model: IModel, name: string): IRelationData<T>;
    isLoadedRelation(model: IModel, relation: string): boolean;
    getLoadedRelations(model: IModel): IRelation<any>[];
    defineAccessor(model: IModel, accessor: string): void;
}
