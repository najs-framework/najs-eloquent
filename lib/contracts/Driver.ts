/// <reference types="najs-binding" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IEventFeature.ts" />
/// <reference path="../definitions/features/IQueryFeature.ts" />
/// <reference path="../definitions/features/ISettingFeature.ts" />
/// <reference path="../definitions/features/IFillableFeature.ts" />
/// <reference path="../definitions/features/ISerializationFeature.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.ts" />
/// <reference path="../definitions/features/IRelationFeature.ts" />

namespace Najs.Contracts.Eloquent {
  export interface Driver<T = any> extends Najs.Contracts.Autoload {
    /**
     * Get RecordManager instance.
     */
    getRecordManager(): NajsEloquent.Feature.IRecordManager<T>

    /**
     * Get SettingFeature instance.
     */
    getSettingFeature(): NajsEloquent.Feature.ISettingFeature

    /**
     * Get EventFeature instance.
     */
    getEventFeature(): NajsEloquent.Feature.IEventFeature

    /**
     * Get QueryFeature instance.
     */
    getQueryFeature(): NajsEloquent.Feature.IQueryFeature

    /**
     * Get FillableFeature instance.
     */
    getFillableFeature(): NajsEloquent.Feature.IFillableFeature

    /**
     * Get SerializationFeature instance.
     */
    getSerializationFeature(): NajsEloquent.Feature.ISerializationFeature

    /**
     * Get TimestampsFeature instance.
     */
    getTimestampsFeature(): NajsEloquent.Feature.ITimestampsFeature

    /**
     * Get SoftDeletesFeature instance.
     */
    getSoftDeletesFeature(): NajsEloquent.Feature.ISoftDeletesFeature

    /**
     * Get GlobalEventEmitter instance.
     */
    getGlobalEventEmitter(): Najs.Contracts.Event.AsyncEventEmitter

    /**
     * Get RelationFeature instance.
     */
    getRelationFeature(): NajsEloquent.Feature.IRelationFeature

    /**
     * Make new instance of model
     *
     * @param {Model} model
     * @param {object} data
     * @param {boolean} isGuarded
     */
    makeModel<M extends NajsEloquent.Model.IModel>(model: M, data?: T | object | string, isGuarded?: boolean): M

    /**
     * Proxy a model instance
     *
     * @param {Model} model
     */
    applyProxy<M extends NajsEloquent.Model.IModel>(model: M): M

    /**
     * Determine that the attribute should be proxied or not
     *
     * @param {Model} model
     * @param {string} name
     */
    shouldBeProxied(model: NajsEloquent.Model.IModel, name: string): boolean

    /**
     * Perform proxy for model.
     *
     * @param {string} type
     * @param {Model} model
     * @param {string} name
     * @param {any} value
     */
    proxify(type: 'get' | 'set', model: NajsEloquent.Model.IModel, name: string, value?: any): any
  }
}
