/// <reference path="../../../../lib/definitions/collect.js/index.d.ts" />
/// <reference path="../../definitions/model/IModel.d.ts" />
/// <reference path="../../definitions/relations/IRelationship.d.ts" />
/// <reference path="../../definitions/relations/IMorphManyRelationship.d.ts" />
/// <reference path="../../definitions/data/IDataCollector.d.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.d.ts" />
import Model = NajsEloquent.Model.IModel;
import ModelDefinition = NajsEloquent.Model.ModelDefinition;
import IMorphManyRelationship = NajsEloquent.Relation.IMorphManyRelationship;
import Collection = CollectJs.Collection;
import { HasOneOrMany } from './HasOneOrMany';
import { MorphOneOrManyExecutor } from './executors/MorphOneOrManyExecutor';
export declare class MorphMany<T extends Model> extends HasOneOrMany<Collection<T>> implements IMorphManyRelationship<T> {
    static className: string;
    protected targetMorphTypeName: string;
    protected executor: MorphOneOrManyExecutor<Collection<T>>;
    constructor(root: Model, relationName: string, target: ModelDefinition, targetType: string, targetKey: string, rootKey: string);
    getClassName(): string;
    getType(): string;
    getExecutor(): MorphOneOrManyExecutor<Collection<T>>;
    associate(...models: Array<T | T[] | CollectJs.Collection<T>>): this;
    dissociate(...models: Array<T | T[] | CollectJs.Collection<T>>): this;
}
