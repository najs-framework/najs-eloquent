/// <reference path="../../definitions/model/IModel.d.ts" />
/// <reference path="../../definitions/relations/IRelationship.d.ts" />
/// <reference path="../../definitions/data/IDataCollector.d.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.d.ts" />
/// <reference path="../../definitions/relations/IMorphOneRelationship.d.ts" />
import Model = NajsEloquent.Model.IModel;
import ModelDefinition = NajsEloquent.Model.ModelDefinition;
import IMorphOneRelationship = NajsEloquent.Relation.IMorphOneRelationship;
import { HasOneOrMany } from './HasOneOrMany';
import { MorphOneOrManyExecutor } from './executors/MorphOneOrManyExecutor';
export declare class MorphOne<T extends Model> extends HasOneOrMany<T> implements IMorphOneRelationship<T> {
    static className: string;
    protected targetMorphTypeName: string;
    protected executor: MorphOneOrManyExecutor<T>;
    constructor(root: Model, relationName: string, target: ModelDefinition, targetType: string, targetKey: string, rootKey: string);
    getClassName(): string;
    getType(): string;
    getExecutor(): MorphOneOrManyExecutor<T>;
    associate(model: T): void;
}
