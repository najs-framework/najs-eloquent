/// <reference path="../../relations/interfaces/IRelationDataBucket.d.ts" />
/// <reference path="../../relations/types/HasOne.d.ts" />
declare namespace NajsEloquent.Model {
    type ModelDefinition<T> = string | {
        new (): IModel<T>;
    };
    class IModelRelation {
        /**
         * Relation data bucket which is used for eager load
         */
        protected relationDataBucket: Relation.IRelationDataBucket;
    }
    interface IModelRelation {
        /**
         * Lazy load relation
         *
         * @param {Array<string|string[]>} args relation name
         */
        load(...args: Array<string | string[]>): Promise<any>;
        /**
         * Get relation by given name
         * @param {string} name
         */
        getRelationByName(name: string): Relation.IRelation;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         */
        hasOne<T>(model: ModelDefinition<T>): Relation.HasOne<T>;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         */
        hasOne<T>(model: ModelDefinition<T>, foreignKey: string): Relation.HasOne<T>;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         * @param {string} localKey
         */
        hasOne<T>(model: ModelDefinition<T>, foreignKey: string, localKey: string): Relation.HasOne<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} model
         */
        belongsTo<T>(model: ModelDefinition<T>): Relation.HasOne<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         */
        belongsTo<T>(model: ModelDefinition<T>, foreignKey: string): Relation.HasOne<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         * @param {string} localKey
         */
        belongsTo<T>(model: ModelDefinition<T>, foreignKey: string, localKey: string): Relation.HasOne<T>;
    }
    interface IModelRelationQuery {
        /**
         * Eager load relations
         *
         * @param {Array<string|string[]>} args relation name
         */
        with(...args: Array<string | string[]>): void;
    }
}
