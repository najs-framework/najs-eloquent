/// <reference path="../../../../lib/definitions/collect.js/index.d.ts" />
/// <reference path="../../definitions/model/IModel.d.ts" />
/// <reference path="../../definitions/data/IDataReader.d.ts" />
/// <reference path="../../definitions/relations/IRelationship.d.ts" />
/// <reference path="../../definitions/relations/IRelationDataBucket.d.ts" />
/// <reference path="../../definitions/relations/IBelongsToManyRelationship.d.ts" />
import Model = NajsEloquent.Model.IModel;
import ModelDefinition = NajsEloquent.Model.ModelDefinition;
import RelationshipFetchType = NajsEloquent.Relation.RelationshipFetchType;
import IRelationshipQuery = NajsEloquent.Relation.IRelationshipQuery;
import IPivotOptions = NajsEloquent.Relation.IPivotOptions;
import IManyToMany = NajsEloquent.Relation.IManyToMany;
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder;
import Collection = CollectJs.Collection;
import { Relationship } from '../Relationship';
import { PivotModel } from './pivot/PivotModel';
export declare abstract class ManyToMany<T extends Model> extends Relationship<Collection<T>> implements IManyToMany<T> {
    protected pivot: ModelDefinition;
    protected pivotModelInstance: Model;
    protected pivotDefinition: typeof PivotModel;
    protected pivotTargetKeyName: string;
    protected pivotRootKeyName: string;
    protected pivotAccessor?: string;
    protected pivotOptions: IPivotOptions;
    protected pivotCustomQueryFn: IRelationshipQuery<T> | undefined;
    constructor(root: Model, relationName: string, target: ModelDefinition, pivot: ModelDefinition, pivotTargetKeyName: string, pivotRootKeyName: string, targetKeyName: string, rootKeyName: string);
    abstract getType(): string;
    abstract getClassName(): string;
    abstract collectData(): Collection<T> | undefined | null;
    abstract fetchPivotData(type: RelationshipFetchType): Promise<CollectJs.Collection<Model>>;
    isInverseOf<K>(relation: NajsEloquent.Relation.IRelationship<K>): boolean;
    protected readonly pivotModel: Model;
    protected getPivotAccessor(): string;
    newPivot(data?: object, isGuarded?: boolean): Model;
    newPivotQuery(name?: string, raw?: boolean): IQueryBuilder<Model>;
    applyPivotCustomQuery(queryBuilder: IQueryBuilder<any>): IQueryBuilder<any>;
    withPivot(...fields: Array<string | string[]>): this;
    as(accessor: string): this;
    withTimestamps(createdAt?: string, updatedAt?: string): this;
    withSoftDeletes(deletedAt?: string): this;
    queryPivot(cb: IRelationshipQuery<T>): this;
    getPivotOptions(name?: string): IPivotOptions;
    setPivotDefinition(definition: typeof PivotModel): void;
    private setFillableToPivotDefinitionIfNeeded;
    private setTimestampsToPivotDefinitionIfNeeded;
    private setSoftDeletesToPivotDefinitionIfNeeded;
}
