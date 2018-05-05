/// <reference path="../../model/interfaces/IModel.d.ts" />
/// <reference path="IRelationQuery.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IRelation {
        /**
         * Get the relation name.
         */
        getRelationName(): string;
        /**
         * Get new query based on the relation.
         */
        getRelation(): IRelationQuery;
        /**
         * Determine the relationship is loaded or not.
         */
        isLoaded(): boolean;
        /**
         * Lazy load relation data.
         */
        lazyLoad<T>(parentModel: Model.IModel<T>): Promise<any>;
        /**
         * Lazy load relation data.
         */
        eagerLoad<T>(parentModel: Model.IModel<T>): Promise<any>;
        /**
         * Get RelationDataBucket which contains eager data.
         */
        getDataBucket(): IRelationDataBucket;
        /**
         * Set RelationDataBucket which contains eager data.
         *
         * @param {IRelationDataBucket} bucket
         */
        setDataBucket(bucket: IRelationDataBucket): this;
    }
}
