/// <reference types="najs-binding" />
/// <reference path="../../model/interfaces/IModel.ts" />
/// <reference path="../../model/interfaces/IModel.ts" />
/// <reference path="../../collect.js/index.d.ts" />

namespace NajsEloquent.Relation {
  export interface IRelationDataBucket extends Najs.Contracts.Autoload {
    /**
     * Register the model's name under given name, this use for mapping from records to Model.
     *
     * @param {string} name
     * @param {string} modelName
     */
    register(name: string, modelName: string): this

    /**
     * Create new model instance and push the record to eager bucket under given name.
     *
     * @param {string} name model's schema/table name
     * @param {Object} record data
     */
    newInstance<T>(name: string, record: Object): T

    /**
     * Create new collection of model and push the records to eager bucket under given name.
     *
     * @param name
     * @param records
     */
    newCollection<T>(name: string, records: Object[]): CollectJs.Collection<T>
  }
}
