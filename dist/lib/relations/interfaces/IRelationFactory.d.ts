/// <reference path="../../model/interfaces/IModel.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IRelationFactory {
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         */
        hasOne<T>(model: Model.ModelDefinition<T>): IHasOne<T>;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         */
        hasOne<T>(model: Model.ModelDefinition<T>, foreignKey: string): IHasOne<T>;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         * @param {string} localKey
         */
        hasOne<T>(model: Model.ModelDefinition<T>, foreignKey: string, localKey: string): IHasOne<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} model
         */
        belongsTo<T>(model: Model.ModelDefinition<T>): IHasOne<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         */
        belongsTo<T>(model: Model.ModelDefinition<T>, foreignKey: string): IHasOne<T>;
        /**
         * Has one inverse relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         * @param {string} localKey
         */
        belongsTo<T>(model: Model.ModelDefinition<T>, foreignKey: string, localKey: string): IHasOne<T>;
    }
}
