/// <reference path="IFeature.d.ts" />
/// <reference path="../model/IModel.d.ts" />
declare namespace NajsEloquent.Feature {
    interface IQueryFeature extends IFeature {
        /**
         * Create new query builder for model.
         */
        newQuery<M extends NajsEloquent.Model.IModel>(model: M): NajsEloquent.QueryBuilder.IQueryBuilder<M>;
    }
}
