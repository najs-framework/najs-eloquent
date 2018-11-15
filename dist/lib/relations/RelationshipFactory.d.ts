/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/relations/IRelationship.d.ts" />
/// <reference path="../definitions/relations/IRelationshipFactory.d.ts" />
/// <reference path="../definitions/relations/IHasOneRelationship.d.ts" />
/// <reference path="../definitions/relations/IBelongsToManyRelationship.d.ts" />
/// <reference path="../definitions/relations/IMorphOneRelationship.d.ts" />
/// <reference path="../definitions/relations/IMorphManyRelationship.d.ts" />
/// <reference path="../definitions/relations/IMorphToRelationship.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import ModelDefinition = NajsEloquent.Model.ModelDefinition;
import IRelationship = NajsEloquent.Relation.IRelationship;
import IRelationshipFactory = NajsEloquent.Relation.IRelationshipFactory;
import IHasOne = NajsEloquent.Relation.IHasOneRelationship;
import IBelongsTo = NajsEloquent.Relation.IBelongsToRelationship;
import IHasMany = NajsEloquent.Relation.IHasManyRelationship;
import IBelongsToMany = NajsEloquent.Relation.IBelongsToManyRelationship;
import IMorphOne = NajsEloquent.Relation.IMorphOneRelationship;
import IMorphMany = NajsEloquent.Relation.IMorphManyRelationship;
import IMorphTo = NajsEloquent.Relation.IMorphToRelationship;
export declare class RelationshipFactory implements IRelationshipFactory {
    protected rootModel: IModel;
    protected name: string;
    protected relationship: IRelationship<any>;
    constructor(rootModel: IModel, name: string);
    make<T extends IRelationship<any>>(className: string, params: any[], modifier?: (relation: T) => void): T;
    findForeignKeyName(referencing: IModel, referenced: IModel): string;
    protected makeHasOneOrMany(className: string, target: ModelDefinition<any>, targetKey?: string, localKey?: string): IRelationship<any>;
    hasOne<T extends IModel>(target: ModelDefinition<any>, targetKey?: string, localKey?: string): IHasOne<T>;
    hasMany<T extends IModel>(target: ModelDefinition<any>, targetKey?: string, localKey?: string): IHasMany<T>;
    belongsTo<T extends IModel>(target: ModelDefinition<any>, targetKey?: string, localKey?: string): IBelongsTo<T>;
    findPivotTableName(a: IModel, b: IModel): string;
    findPivotReferenceName(model: IModel): string;
    belongsToMany<T extends IModel>(target: Definition<T>, pivot?: Definition<any>, pivotTargetKeyName?: string, pivotRootKeyName?: string, targetKeyName?: string, rootKeyName?: string): IBelongsToMany<T>;
    protected makeMorphOneOrMany(className: string, target: Definition<any>, targetType: string, targetKey?: string, localKey?: string): IRelationship<any>;
    morphOne<T extends IModel>(target: Definition<T>, name: string, targetKey?: string, localKey?: string): IMorphOne<T>;
    morphMany<T extends IModel>(target: Definition<T>, name: string, targetKey?: string, localKey?: string): IMorphMany<T>;
    morphTo<T extends IModel>(rootType?: string, rootKey?: string, targetKeyMap?: {
        [name in string]: string;
    }): IMorphTo<T>;
}
