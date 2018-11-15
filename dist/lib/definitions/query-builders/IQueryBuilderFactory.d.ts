/// <reference path="../model/IModel.d.ts" />
/// <reference path="IQueryBuilder.d.ts" />
/// <reference path="IQueryBuilderHandler.d.ts" />
declare namespace NajsEloquent.QueryBuilder {
    interface IQueryBuilderFactory extends Najs.Contracts.Autoload {
        /**
         * Make new query builder instance from a model.
         *
         * @param {Model} model
         */
        make(model: Model.IModel): IQueryBuilder<any>;
    }
}
