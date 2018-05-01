/// <reference path="../../contracts/Driver.d.ts" />
/// <reference path="IModelSetting.d.ts" />
/// <reference path="IModelAttribute.d.ts" />
/// <reference path="IModelFillable.d.ts" />
/// <reference path="IModelSerialization.d.ts" />
/// <reference path="IModelActiveRecord.d.ts" />
/// <reference path="IModelQuery.d.ts" />
/// <reference path="IModelTimestamps.d.ts" />
/// <reference path="IModelSoftDeletes.d.ts" />
/// <reference path="IModelRelation.d.ts" />
/// <reference path="IModelDynamicAttribute.d.ts" />
declare namespace NajsEloquent.Model {
    class IModel<T> {
        /**
         * The model's attributes.
         */
        protected attributes: T;
        /**
         * The driver associated with the model.
         */
        protected driver: Najs.Contracts.Eloquent.Driver<T>;
        /**
         * The settings associated with the model
         */
        protected settings?: Object;
    }
    interface IModel<T> extends IModelAttribute, IModelDynamicAttribute, IModelFillable, IModelSerialization, IModelActiveRecord, IModelTimestamps, IModelSoftDeletes, IModelRelation {
        /**
         * Get class name of the model.
         */
        getClassName(): string;
        /**
         * Get model name of the model, returns .getClassName() by default.
         */
        getModelName(): string;
        /**
         * Get record name of the model, returns .driver.getRecordName() by default.
         */
        getRecordName(): string;
        /**
         * Determine if two models have the same ID and belong to the same table/collection.
         *
         * @param {Model} model
         */
        is(model: IModel<T>): boolean;
        /**
         * Create new Collection from an array of raw attributes.
         *
         * @param {Array<Object>} list
         */
        newCollection(list: any[]): any;
        /**
         * Create new instance from raw attributes.
         *
         * @param {Object} data
         */
        newInstance(data: Object | T): this;
    }
    type ModelMethod<T, R = T> = (this: IModel<any> & IModelSetting & IModelQuery<any, any>, ...args: any[]) => R;
}
