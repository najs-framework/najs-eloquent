/// <reference path="../../../../lib/definitions/collect.js/index.d.ts" />
/// <reference path="../model/IModel.d.ts" />
/// <reference path="../query-builders/IQueryBuilder.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IManyToMany<T> extends IRelationship<CollectJs.Collection<T>> {
        /**
         * Create new pivot model instance.
         */
        newPivot(): Model.IModel;
        /**
         * Create new pivot model instance with data.
         */
        newPivot(data: object): Model.IModel;
        /**
         * Create new pivot model instance with data and guarded options.
         */
        newPivot(data: object, isGuarded: boolean): Model.IModel;
        /**
         * Create new Pivot query linked to the model.
         */
        newPivotQuery(): QueryBuilder.IQueryBuilder<Model.IModel>;
        /**
         * Create new Pivot query linked to the model with name.
         */
        newPivotQuery(name: string): QueryBuilder.IQueryBuilder<Model.IModel>;
        /**
         * Create new raw or linked Pivot query with name.
         *
         * Note:
         *   - raw query is an empty query
         *   - linked query is a query already have condition linked to current model.
         */
        newPivotQuery(name: string, raw: boolean): QueryBuilder.IQueryBuilder<Model.IModel>;
        /**
         * Define additional fields in pivot model.
         *
         * @param {string|string[]} fields
         */
        withPivot(...fields: Array<string | string[]>): this;
        /**
         * Specify the custom pivot accessor to use for the relationship.
         */
        as(accessor: string): this;
        /**
         * Specify that the pivot table has creation and update timestamps.
         */
        withTimestamps(): this;
        /**
         * Specify that the pivot table has creation and update timestamps.
         *
         * @param {string} createdAt
         * @param {string} updatedAt
         */
        withTimestamps(createdAt: string, updatedAt: string): this;
        /**
         * Specify that the pivot table has soft deletes feature.
         */
        withSoftDeletes(): this;
        /**
         * Specify that the pivot table has soft deletes feature.
         *
         * @param {string} deletedAt
         */
        withSoftDeletes(deletedAt: string): this;
        /**
         * Add custom query to relationship.
         */
        queryPivot(cb: IRelationshipQuery<T>): this;
    }
}
