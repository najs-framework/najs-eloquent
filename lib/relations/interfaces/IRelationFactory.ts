/// <reference path="../../model/interfaces/IModel.ts" />

namespace NajsEloquent.Relation {
  export interface IRelationFactory {
    /**
     * Has one relationship
     *
     * @param {string|ModelDefinition} model
     */
    hasOne<T>(model: Model.ModelDefinition<T> | string): IHasOne<T>

    /**
     * Has one relationship
     *
     * @param {string|ModelDefinition} model
     * @param {string} foreignKey
     */
    hasOne<T>(model: Model.ModelDefinition<T> | string, foreignKey: string): IHasOne<T>

    /**
     * Has one relationship
     *
     * @param {string|ModelDefinition} model
     * @param {string} foreignKey
     * @param {string} localKey
     */
    hasOne<T>(model: Model.ModelDefinition<T> | string, foreignKey: string, localKey: string): IHasOne<T>

    /**
     * Has one relationship
     *
     * @param {string|ModelDefinition} model
     */
    hasMany<T>(model: Model.ModelDefinition<T> | string): IHasMany<T>

    /**
     * Has one relationship
     *
     * @param {string|ModelDefinition} model
     * @param {string} foreignKey
     */
    hasMany<T>(model: Model.ModelDefinition<T> | string, foreignKey: string): IHasMany<T>

    /**
     * Has one relationship
     *
     * @param {string|ModelDefinition} model
     * @param {string} foreignKey
     * @param {string} localKey
     */
    hasMany<T>(model: Model.ModelDefinition<T> | string, foreignKey: string, localKey: string): IHasMany<T>

    /**
     * Has one inverse relationship
     *
     * @param {string|ModelDefinition} model
     */
    belongsTo<T>(model: Model.ModelDefinition<T>): IHasOne<T>

    /**
     * Has one inverse relationship
     *
     * @param {string|ModelDefinition} model
     * @param {string} foreignKey
     */
    belongsTo<T>(model: Model.ModelDefinition<T>, foreignKey: string): IHasOne<T>

    /**
     * Has one inverse relationship
     *
     * @param {string|ModelDefinition} model
     * @param {string} foreignKey
     * @param {string} localKey
     */
    belongsTo<T>(model: Model.ModelDefinition<T>, foreignKey: string, localKey: string): IHasOne<T>
  }
}
