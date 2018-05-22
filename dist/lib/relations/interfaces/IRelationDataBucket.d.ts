/// <reference path="../../model/interfaces/IModel.d.ts" />
/// <reference path="../../../../lib/collect.js/index.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IRelationDataBucket extends Najs.Contracts.Autoload {
        /**
         * Register the model's name under given name, this use for mapping from records to Model.
         *
         * @param {string} name
         * @param {string} modelName
         */
        register(name: string, modelName: string): this;
        /**
         * Create new model instance and push the record to eager bucket under given name.
         *
         * @param {string} name model's schema/table name
         * @param {Object} record data
         */
        newInstance<T>(name: string, record: Object): T;
        /**
         * Create new collection of model and push the records to eager bucket under given name.
         *
         * @param name
         * @param records
         */
        newCollection<T>(name: string, records: Object[]): CollectJs.Collection<T>;
        /**
         * Make model from name and record.
         *
         * @param {string} name
         * @param {Object} record
         */
        makeModelFromRecord(name: string, record: Object): NajsEloquent.Model.IModel<any>;
        /**
         * Make collection of model from name and records.
         *
         * @param {string} name
         * @param {Object} record
         */
        makeCollectionFromRecords(name: string, records: Object[]): CollectJs.Collection<NajsEloquent.Model.IModel<any>>;
        /**
         * Get list of given attribute in bucket by name.
         * @param {string} name
         * @param {string} attribute
         * @param {boolean} allowDuplicated if true will remove duplicated values. Default is false
         */
        getAttributes(name: string, attribute: string, allowDuplicated?: boolean): any[];
        /**
         * Filter table in bucket by given key and value.
         *
         * @param {string} name
         * @param {string} key
         * @param {mixed} value
         */
        filter(name: string, key: string, value: string, getFirstOnly?: boolean): Object[];
    }
}
