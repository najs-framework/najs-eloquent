/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="../wrappers/interfaces/IQueryBuilderWrapper.d.ts" />
declare namespace Najs.Contracts.Eloquent {
    interface Driver<NativeRecord> extends Najs.Contracts.Autoload {
        /**
         * Initialize driver for a model.
         *
         * @param {Eloquent} model the attached model
         * @param {boolean} isGuarded
         * @param {Object|NativeRecord} data
         */
        initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: NativeRecord | Object): void;
        /**
         * Get the record's name, i.e
         *  - With MySQL it is a table's name
         *  - With Mongoose it is a collection's name
         */
        getRecordName(): string;
        /**
         * Get the native record instance.
         */
        getRecord(): NativeRecord;
        /**
         * Set the native record instance.
         */
        setRecord(record: NativeRecord): void;
        /**
         * Determine that this driver depends on EloquentProxy.
         */
        useEloquentProxy(): boolean;
        /**
         * Determine given key should be forward to driver or not.
         */
        shouldBeProxied(key: string): boolean;
        /**
         * Perform Eloquent proxy
         *
         * @param {string} type
         * @param {Eloquent} target
         * @param {string} key
         * @param {any} value
         */
        proxify(type: 'get' | 'set', target: any, key: string, value?: any): any;
        /**
         * Determine given attribute is in the model or not.
         *
         * @param name
         */
        hasAttribute(name: string): boolean;
        /**
         * Get given attribute value.
         *
         * @param {string} name
         */
        getAttribute<T>(name: string): T;
        /**
         * Set given attribute with given value.
         *
         * @param {string} name
         * @param {mixed} value
         */
        setAttribute<T>(name: string, value: T): boolean;
        /**
         * Get the primary key name.
         */
        getPrimaryKeyName(): string;
        /**
         * Get raw object data of the native record.
         */
        toObject(): Object;
        /**
         * Create and return new query builder.
         */
        newQuery<T>(): NajsEloquent.Wrapper.IQueryBuilderWrapper<T>;
        /**
         * Delete the attached model.
         *
         * @param {boolean} softDeletes
         */
        delete(softDeletes: boolean): Promise<boolean>;
        /**
         * Restore the attached model
         */
        restore(): Promise<boolean>;
        /**
         * Save the attached model
         */
        save(): Promise<boolean>;
        /**
         * Mark given attribute is modified.
         *
         * @param {string} name
         */
        markModified(name: string): void;
        /**
         * Determine the model is new or not.
         */
        isNew(): boolean;
        /**
         * Determine the model is soft-deleted or not.
         */
        isSoftDeleted(): boolean;
        /**
         * Format given attribute name
         *
         * @param {string} name
         */
        formatAttributeName(name: string): string;
        /**
         * Return the component name which design to attach to Model.
         */
        getModelComponentName(): string | undefined;
        /**
         * Sort the given components name to correct order.
         *
         * @param {string[]} components
         */
        getModelComponentOrder(components: string[]): string[];
    }
}
