/// <reference path="../../definitions/model/IModel.d.ts" />
/// <reference path="../../definitions/relations/IRelationship.d.ts" />
/// <reference path="../../definitions/relations/IRelationDataBucket.d.ts" />
/// <reference path="../../definitions/relations/IMorphToRelationship.d.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.d.ts" />
import Model = NajsEloquent.Model.IModel;
import IMorphToRelationship = NajsEloquent.Relation.IMorphToRelationship;
import RelationshipFetchType = NajsEloquent.Relation.RelationshipFetchType;
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket;
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder;
import { Relationship } from '../Relationship';
export declare class MorphTo<T extends Model> extends Relationship<T> implements IMorphToRelationship<T> {
    static className: string;
    protected rootMorphTypeName: string;
    protected targetKeyNameMap: {
        [key in string]: string;
    };
    private targetModelInstances;
    constructor(root: Model, relationName: string, rootType: string, rootKey: string, targetKeyNameMap: {
        [key in string]: string;
    });
    getClassName(): string;
    getType(): string;
    makeTargetModel(modelName: string): Model;
    createQueryForTarget(targetModel: Model): IQueryBuilder<any>;
    findTargetKeyName(targetModel: Model): string;
    collectDataInBucket(dataBucket: IRelationDataBucket, targetModel: Model): object[];
    collectData(): T | undefined | null;
    getEagerFetchInfo(dataBucket: IRelationDataBucket): {};
    eagerFetchData(): Promise<T | undefined | null>;
    fetchData(type: RelationshipFetchType): Promise<T | undefined | null>;
    isInverseOf<K>(relationship: NajsEloquent.Relation.IRelationship<K>): boolean;
}
