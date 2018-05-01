/// <reference path="interfaces/IModel.d.ts" />
/// <reference path="interfaces/IModelQuery.d.ts" />
/// <reference path="interfaces/static/IMongooseStatic.d.ts" />
import { Model } from './Model';
import { MongooseQueryBuilderWrapper } from '../wrappers/MongooseQueryBuilderWrapper';
export interface EloquentStaticMongoose<T> extends NajsEloquent.Model.Static.IMongooseStatic<T, MongooseQueryBuilderWrapper<Model<T> & T>> {
}
export interface Eloquent<T extends Object = {}> extends NajsEloquent.Model.IModelQuery<T, NajsEloquent.Wrapper.IQueryBuilderWrapper<Model<T> & T>> {
}
export declare class Eloquent<T extends Object = {}> extends Model<T> {
    /**
     * Model constructor.
     *
     * @param {Object|undefined} data
     */
    constructor(data?: Object, isGuarded?: boolean);
    /**
     * Register given model.
     *
     * @param {Eloquent} model
     */
    static register(model: {
        new (): Eloquent<any> | Model<any> | NajsEloquent.Model.IModel<any>;
    }): void;
    static Mongoose<T>(): EloquentStaticMongoose<T>;
    static Class<T>(): EloquentStaticMongoose<T>;
}
