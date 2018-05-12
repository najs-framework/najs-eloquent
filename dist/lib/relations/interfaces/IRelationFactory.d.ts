/// <reference path="../../model/interfaces/IModel.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IRelationFactory {
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         */
        hasOne<T>(model: Model.ModelDefinition<T> | string): IHasOne<T>;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         */
        hasOne<T>(model: Model.ModelDefinition<T> | string, foreignKey: string): IHasOne<T>;
        /**
         * Has one relationship
         *
         * @param {string|ModelDefinition} model
         * @param {string} foreignKey
         * @param {string} localKey
         */
        hasOne<T>(model: Model.ModelDefinition<T> | string, foreignKey: string, localKey: string): IHasOne<T>;
    }
}
