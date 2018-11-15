/// <reference types="najs-binding" />
/// <reference path="../model/IModel.ts" />
/// <reference path="./IQueryBuilder.ts" />
/// <reference path="./IQueryBuilderHandler.ts" />

namespace NajsEloquent.QueryBuilder {
  export declare interface IQueryBuilderFactory extends Najs.Contracts.Autoload {
    /**
     * Make new query builder instance from a model.
     *
     * @param {Model} model
     */
    make(model: Model.IModel): IQueryBuilder<any>
  }
}
