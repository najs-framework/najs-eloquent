/// <reference path="./IFeature.ts" />
/// <reference path="../model/IModel.ts" />

namespace NajsEloquent.Feature {
  export interface IQueryFeature extends IFeature {
    /**
     * Create new query builder for model.
     */
    newQuery<M extends NajsEloquent.Model.IModel>(model: M): NajsEloquent.QueryBuilder.IQueryBuilder<M>
  }
}
