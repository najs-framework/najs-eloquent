/// <reference path="../model/IModel.d.ts" />
/// <reference path="IHasOneRelationship.d.ts" />
/// <reference path="IBelongsToRelationship.d.ts" />
/// <reference path="IHasManyRelationship.d.ts" />
/// <reference path="IBelongsToManyRelationship.d.ts" />
/// <reference path="IMorphOneRelationship.d.ts" />
/// <reference path="IMorphManyRelationship.d.ts" />
/// <reference path="IMorphToRelationship.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import Definition = NajsEloquent.Model.ModelDefinition;
import IHasOne = NajsEloquent.Relation.IHasOneRelationship;
import IHasMany = NajsEloquent.Relation.IHasManyRelationship;
import IBelongsTo = NajsEloquent.Relation.IBelongsToRelationship;
import IBelongsToMany = NajsEloquent.Relation.IBelongsToManyRelationship;
import IMorphOne = NajsEloquent.Relation.IMorphOneRelationship;
import IMorphMany = NajsEloquent.Relation.IMorphManyRelationship;
import IMorphTo = NajsEloquent.Relation.IMorphToRelationship;
declare namespace NajsEloquent.Relation {
    interface IRelationshipFactory {
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} target
         */
        hasOne<T extends IModel>(target: Definition<T>): IHasOne<T>;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         */
        hasOne<T extends IModel>(target: Definition<T>, targetKey: string): IHasOne<T>;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         * @param {string} localKey
         */
        hasOne<T extends IModel>(target: Definition<T>, targetKey: string, localKey: string): IHasOne<T>;
        /**
         * Has many relationship
         *
         * @param {string|ModelDefinition} target
         */
        hasMany<T extends IModel>(target: Definition<T>): IHasMany<T>;
        /**
         * Has many relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         */
        hasMany<T extends IModel>(target: Definition<T>, targetKey: string): IHasMany<T>;
        /**
         * Has many relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         * @param {string} localKey
         */
        hasMany<T extends IModel>(target: Definition<T>, targetKey: string, localKey: string): IHasMany<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} target
         */
        belongsTo<T extends IModel>(target: Definition<T>): IBelongsTo<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         */
        belongsTo<T extends IModel>(target: Definition<T>, targetKey: string): IBelongsTo<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         * @param {string} localKey
         */
        belongsTo<T extends IModel>(target: Definition<T>, targetKey: string, localKey: string): IBelongsTo<T>;
        /**
         * Define many to many relationship
         *
         * @param {string|ModelDefinition} target
         */
        belongsToMany<T extends IModel>(target: Definition<T>): IBelongsToMany<T>;
        /**
         * Define many to many relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string|ModelDefinition} pivot
         */
        belongsToMany<T extends IModel>(target: Definition<T>, pivot: Definition<any>): IBelongsToMany<T>;
        /**
         * Define many to many relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string|ModelDefinition} pivot
         * @param {string} pivotTargetKeyName
         * @param {string} pivotRootKeyName
         */
        belongsToMany<T extends IModel>(target: Definition<T>, pivot: Definition<any>, pivotTargetKeyName: string, pivotRootKeyName: string): IBelongsToMany<T>;
        /**
         * Define many to many relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string|ModelDefinition} pivot
         * @param {string} pivotTargetKeyName
         * @param {string} pivotRootKeyName
         * @param {string} targetKeyName
         * @param {string} rootKeyName
         */
        belongsToMany<T extends IModel>(target: Definition<T>, pivot: Definition<any>, pivotTargetKeyName: string, pivotRootKeyName: string, targetKeyName: string, rootKeyName: string): IBelongsToMany<T>;
        /**
         * Morph one relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} field
         */
        morphOne<T extends IModel>(target: Definition<T>, name: string): IMorphOne<T>;
        /**
         * Morph one relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         */
        morphOne<T extends IModel>(target: Definition<T>, targetType: string, targetKey: string): IMorphOne<T>;
        /**
         * Morph one relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         * @param {string} localKey
         */
        morphOne<T extends IModel>(target: Definition<T>, targetType: string, targetKey: string, localKey: string): IMorphOne<T>;
        /**
         * Morph many relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} field
         */
        morphMany<T extends IModel>(target: Definition<T>, name: string): IMorphMany<T>;
        /**
         * Morph many relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         */
        morphMany<T extends IModel>(target: Definition<T>, targetType: string, targetKey: string): IMorphMany<T>;
        /**
         * Morph many relationship
         *
         * @param {string|ModelDefinition} target
         * @param {string} targetKey
         * @param {string} localKey
         */
        morphMany<T extends IModel>(target: Definition<T>, targetType: string, targetKey: string, localKey: string): IMorphMany<T>;
        /**
         * Create morph to relationship
         */
        morphTo<T extends IModel>(): IMorphTo<T>;
        /**
         * Create morph to relationship
         */
        morphTo<T extends IModel>(rootType: string, rootKey: string): IMorphTo<T>;
        /**
         * Create morph to relationship
         */
        morphTo<T extends IModel>(rootType: string, rootKey: string, targetKeyMap: {
            [name in string]: string;
        }): IMorphTo<T>;
    }
}
