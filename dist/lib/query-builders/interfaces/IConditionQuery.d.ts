export declare type Operator = '=' | '==' | '!=' | '<>' | '<' | '<=' | '=<' | '>' | '>=' | '=>' | 'in' | 'not-in';
export declare type SubCondition = (query: IConditionQuery) => any;
export interface IConditionQuery {
    /**
     * Add a basic where clause to the query.
     *
     * @param {Function} conditionBuilder sub-query builder
     */
    where(conditionBuilder: SubCondition): this;
    /**
     * Add a basic where clause to the query.
     *
     * @param {string} field
     * @param {mixed} value
     */
    where(field: string, value: any): this;
    /**
     * Add a basic where clause to the query.
     *
     * @param {string} field
     * @param {string} operator
     * @param {mixed} value
     */
    where(field: string, operator: Operator, value: any): this;
    /**
     * Add an "or where" clause to the query.
     *
     * @param {Function} conditionBuilder
     */
    orWhere(conditionBuilder: SubCondition): this;
    /**
     * Add an "or where" clause to the query.
     *
     * @param {string} field
     * @param {mixed} value
     */
    orWhere(field: string, value: any): this;
    /**
     * Add an "or where" clause to the query.
     *
     * @param {string} field
     * @param {string} operator
     * @param {mixed} value
     */
    orWhere(field: string, operator: Operator, value: any): this;
    /**
     * Add a "where in" clause to the query.
     *
     * @param {string} field
     * @param {any[]} values
     */
    whereIn(field: string, values: Array<any>): this;
    /**
     * Add a "where not in" clause to the query.
     *
     * @param {string} field
     * @param {any[]} values
     */
    whereNotIn(field: string, values: Array<any>): this;
    /**
     * Add an "or where in" clause to the query.
     *
     * @param {string} field
     * @param {any[]} values
     */
    orWhereIn(field: string, values: Array<any>): this;
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
    whereNotNull(field: string): this;
    /**
     * Add an "or where null" clause to the query.
     *
     * @param {string} field
     */
    orWhereNull(field: string): this;
    /**
     * Add an "or where not null" clause to the query.
     *
     * @param {string} field
     */
    orWhereNotNull(field: string): this;
}
