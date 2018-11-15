/// <reference path="../../definitions/model/IModel.d.ts" />
/// <reference path="../../definitions/relations/IRelationship.d.ts" />
/// <reference path="../../definitions/relations/IBelongsToRelationship.d.ts" />
import Model = NajsEloquent.Model.IModel;
import IBelongsToRelationship = NajsEloquent.Relation.IBelongsToRelationship;
import { HasOneOrMany } from './HasOneOrMany';
import { HasOneExecutor } from './executors/HasOneExecutor';
export declare class BelongsTo<T extends Model> extends HasOneOrMany<T> implements IBelongsToRelationship<T> {
    static className: string;
    protected executor: HasOneExecutor<T>;
    getClassName(): string;
    getType(): string;
    getExecutor(): HasOneExecutor<T>;
    dissociate(): void;
}
