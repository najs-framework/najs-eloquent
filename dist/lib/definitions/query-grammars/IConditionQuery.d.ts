/// <reference path="IBasicConditionQuery.d.ts" />
declare namespace NajsEloquent.QueryGrammar {
    interface IConditionQuery extends IBasicConditionQuery {
        /**
         * Add a basic where clause to the query.
         *
         * @param {Function} conditionBuilder sub-query builder
         */
        andWhere(conditionBuilder: SubCondition): this;
        /**
         * Add a basic where clause to the query.
         *
         * @param {string} field
         * @param {mixed} value
         */
        andWhere(field: string, value: any): this;
        /**
         * Add a basic where clause to the query.
         *
         * @param {string} field
         * @param {string} operator
         * @param {mixed} value
         */
        andWhere(field: string, operator: Operator, value: any): this;
        /**
         * Add a "where not" clause to the query.
         *
         * @param {string} field
         * @param {mixed} value
         */
        whereNot(field: string, value: any): this;
        /**
         * Add a "where not" clause to the query.
         *
         * @param {string} field
         * @param {mixed} value
         */
        andWhereNot(field: string, value: any): this;
        /**
         * Add an "or where not" clause to the query.
         *
         * @param {string} field
         * @param {mixed} value
         */
        orWhereNot(field: string, value: any): this;
        /**
         * Add a "where in" clause to the query.
         *
         * @param {string} field
         * @param {any[]} values
         */
        whereIn(field: string, values: Array<any>): this;
        /**
         * Add a "where in" clause to the query.
         *
         * @param {string} field
         * @param {any[]} values
         */
        andWhereIn(field: string, values: Array<any>): this;
        /**
         * Add an "or where in" clause to the query.
         *
         * @param {string} field
         * @param {any[]} values
         */
        orWhereIn(field: string, values: Array<any>): this;
        /**
         * Add a "where not in" clause to the query.
         *
         * @param {string} field
         * @param {any[]} values
         */
        whereNotIn(field: string, values: Array<any>): this;
        /**
         * Add a "where not in" clause to the query.
         *
         * @param {string} field
         * @param {any[]} values
         */
        andWhereNotIn(field: string, values: Array<any>): this;
        /**
         * Add an "or where in" clause to the query.
         *
         * @param {string} field
         * @param {any[]} values
         */
        orWhereNotIn(field: string, values: Array<any>): this;
        /**
         * Add a "where null" clause to the query.
         *
         * @param {string} field
         */
        whereNull(field: string): this;
        /**
         * Add a "where null" clause to the query.
         *
         * @param {string} field
         */
        andWhereNull(field: string): this;
        /**
         * Add an "or where null" clause to the query.
         *
         * @param {string} field
         */
        orWhereNull(field: string): this;
        /**
         * Add a "where null" clause to the query.
         *
         * @param {string} field
         */
        whereNotNull(field: string): this;
        /**
         * Add a "where null" clause to the query.
         *
         * @param {string} field
         */
        andWhereNotNull(field: string): this;
        /**
         * Add an "or where not null" clause to the query.
         *
         * @param {string} field
         */
        orWhereNotNull(field: string): this;
        /**
         * Add a "where between" clause to the query.
         *
         * @param {string} field
         */
        whereBetween(field: string, range: Range): this;
        /**
         * Add a "where between" clause to the query.
         *
         * @param {string} field
         */
        andWhereBetween(field: string, range: Range): this;
        /**
         * Add an "or where between" clause to the query.
         *
         * @param {string} field
         */
        orWhereBetween(field: string, range: Range): this;
        /**
         * Add a "where not between" clause to the query.
         *
         * @param {string} field
         */
        whereNotBetween(field: string, range: Range): this;
        /**
         * Add a "where not between" clause to the query.
         *
         * @param {string} field
         */
        andWhereNotBetween(field: string, range: Range): this;
        /**
         * Add an "or where not between" clause to the query.
         *
         * @param {string} field
         */
        orWhereNotBetween(field: string, range: Range): this;
    }
}
