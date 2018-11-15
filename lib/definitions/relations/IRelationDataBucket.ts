/// <reference path="./IRelationship.ts" />
/// <reference path="../model/IModel.ts" />
/// <reference path="../collect.js/index.d.ts" />

namespace NajsEloquent.Relation {
  export interface IRelationDataBucketMetadata {
    /**
     * Contains loaded relations of this model
     */
    loaded: string[]
  }

  export interface IRelationDataBucket {
    /**
     * add the model to bucket.
     *
     * @param {Model} model
     */
    add(model: Model.IModel): this

    /**
     * Create new model instance and push the record to eager bucket under given model.
     *
     * @param {Model} model
     * @param {object} rawData
     */
    makeModel<M extends Model.IModel = Model.IModel>(model: M, rawData: any): M

    /**
     * Create new collection of model instance and push each model to eager bucket.
     *
     * @param {Model} model
     * @param {object} rawDataList
     */
    makeCollection<M extends Model.IModel = Model.IModel>(model: M, rawDataList: any[]): CollectJs.Collection<M>

    /**
     * Get records gathered data of the RecordBucket by given model.
     *
     * @param {Model} model
     */
    getDataOf(model: Model.IModel): Data.IDataBuffer<object>

    /**
     * Get metadata object of given model.
     *
     * @param {Model} model
     */
    getMetadataOf(model: Model.IModel): IRelationDataBucketMetadata
  }
}
