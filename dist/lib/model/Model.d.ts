/// <reference path="interfaces/IModel.d.ts" />
import { Event } from './Event';
export interface Model<T = any> extends NajsEloquent.Model.IModel<T> {
}
export declare class Model<T = any> {
    static Events: {
        Creating: Event;
        Created: Event;
        Saving: Event;
        Saved: Event;
        Updating: Event;
        Updated: Event;
        Deleting: Event;
        Deleted: Event;
        Restoring: Event;
        Restored: Event;
    };
    /**
     * Model constructor.
     *
     * @param {Object|undefined} data
     * @param {boolean|undefined} isGuarded
     */
    constructor(data?: Object, isGuarded?: boolean);
    getDriver(): Najs.Contracts.Eloquent.Driver<T>;
    getModelName(): string;
    getRecordName(): string;
    is(model: this | NajsEloquent.Model.IModel<T>): boolean;
    newCollection(dataset: any[]): any;
    newInstance(data?: Object | T): this;
}
