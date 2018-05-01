/// <reference path="IModel.d.ts" />
/// <reference path="IModelQueryAdvanced.d.ts" />
/// <reference path="../../wrappers/interfaces/IQueryBuilderWrapper.d.ts" />
declare namespace NajsEloquent.Model {
    /**
     * Interface contains query functions which attached to the model.
     *
     * This interface based on QueryBuilder, but remove not "start" query functions such as .orWhere() .andWhere()
     */
    interface IModelQuery<T, QueryBuilderWrapper extends NajsEloquent.Wrapper.IQueryBuilderWrapper<any>> extends IModelQueryAdvanced<T> {
        /**
         * Create new query builder for model
         */
        newQuery(): QueryBuilderWrapper;
        /**
         * Set the query with given name
         *
         * @param {string} name
         */
        queryName(name: string): QueryBuilderWrapper;
        /**
         * Set the columns or fields to be selected.
         *
         * @param {string|string[]} fields
         */
        select(...fields: Array<string | string[]>): QueryBuilderWrapper;
        /**
         * Set the "limit" value of the query.
         * @param {number} records
         */
        limit(record: number): QueryBuilderWrapper;
        /**
         * Add an "order by" clause to the query.
         *
         * @param {string} field
         */
        orderBy(field: string): QueryBuilderWrapper;
        /**
         * Add an "order by" clause to the query.
         *
         * @param {string} field
         * @param {string} direction
         */
        orderBy(field: string, direction: 'asc' | 'desc'): QueryBuilderWrapper;
        /**
         * Add an "order by" clause to the query with direction ASC.
         *
         * @param {string} field
         * @param {string} direction
         */
        orderByAsc(field: string): QueryBuilderWrapper;
        /**
         * Add an "order by" clause to the query with direction DESC.
         *
         * @param {string} field
         * @param {string} direction
         */
        orderByDesc(field: string): QueryBuilderWrapper;
        /**
         * Add a basic where clause to the query.
         *
         * @param {Function} conditionBuilder sub-query builder
         */
        where(conditionBuilder: NajsEloquent.QueryBuilder.SubCondition): NajsEloquent.Wrapper.IQueryBuilderWrapper<IModel<T> & T>;
        /**
         * Add a basic where clause to the query.
         *
         * @param {string} field
         * @param {mixed} value
         */
        where(field: string, value: any): QueryBuilderWrapper;
        /**
         * Add a basic where clause to the query.
         *
         * @param {string} field
         * @param {string} operator
         * @param {mixed} value
         */
        where(field: string, operator: NajsEloquent.QueryBuilder.Operator, value: any): QueryBuilderWrapper;
        /**
         * Add a "where not" clause to the query.
         *
         * @param {string} field
         * @param {mixed} value
         */
        whereNot(field: string, value: any): this;
        /**
         * Add a "where in" clause to the query.
         *
         * @param {string} field
         * @param {any[]} values
         */
        whereIn(field: string, values: Array<any>): QueryBuilderWrapper;
        /**
         * Add a "where not in" clause to the query.
         *
         * @param {string} field
         * @param {any[]} values
         */
        whereNotIn(field: string, values: Array<any>): QueryBuilderWrapper;
        /**
         * Add a "where null" clause to the query.
         *
         * @param {string} field
         */
        whereNull(field: string): QueryBuilderWrapper;
        /**
         * Add a "where null" clause to the query.
         *
         * @param {string} field
         */
        whereNotNull(field: string): QueryBuilderWrapper;
        /**
         * Add a "where between" clause to the query.
         *
         * @param {string} field
         */
        whereBetween(field: string, range: [any, any]): QueryBuilderWrapper;
        /**
         * Add a "where not between" clause to the query.
         *
         * @param {string} field
         */
        whereNotBetween(field: string, range: [any, any]): QueryBuilderWrapper;
        /**
         * Consider all soft-deleted or not-deleted items.
         */
        withTrashed(): QueryBuilderWrapper;
        /**
         * Consider soft-deleted items only.
         */
        onlyTrashed(): QueryBuilderWrapper;
    }
}
