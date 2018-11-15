/// <reference path="../../definitions/model/IModel.d.ts" />
/// <reference path="../../definitions/relations/IRelationship.d.ts" />
/// <reference path="../../definitions/data/IDataCollector.d.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.d.ts" />
import Model = NajsEloquent.Model.IModel;
import ModelDefinition = NajsEloquent.Model.ModelDefinition;
import RelationshipFetchType = NajsEloquent.Relation.RelationshipFetchType;
import { Relationship } from '../Relationship';
import { IHasOneOrManyExecutor } from './executors/HasOneOrManyExecutor';
export declare abstract class HasOneOrMany<T> extends Relationship<T> {
    constructor(root: Model, relationName: string, target: ModelDefinition, targetKey: string, rootKey: string);
    abstract getClassName(): string;
    abstract getType(): string;
    abstract getExecutor(): IHasOneOrManyExecutor<T>;
    collectData(): T | undefined | null;
    fetchData(type: RelationshipFetchType): Promise<T | undefined | null>;
    isInverseOf<K>(relationship: NajsEloquent.Relation.IRelationship<K>): boolean;
    isInverseOfTypeMatched(relationship: HasOneOrMany<any>): boolean;
}
