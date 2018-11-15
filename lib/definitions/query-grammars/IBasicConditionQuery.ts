namespace NajsEloquent.QueryGrammar {
  export type Range<T = any> = [T, T]
  export type Operator = '=' | '==' | '!=' | '<>' | '<' | '<=' | '=<' | '>' | '>=' | '=>' | 'in' | 'not-in'
  export type SubCondition = (query: IConditionQuery) => any

  export interface IBasicConditionQuery {
    /**
     * Add a basic where clause to the query.
     *
     * @param {Function} conditionBuilder sub-query builder
     */
    where(conditionBuilder: SubCondition): this
    /**
     * Add a basic where clause to the query.
     *
     * @param {string} field
     * @param {mixed} value
     */
    where(field: string, value: any): this
    /**
     * Add a basic where clause to the query.
     *
     * @param {string} field
     * @param {string} operator
     * @param {mixed} value
     */
    where(field: string, operator: Operator, value: any): this

    /**
     * Add an "or where" clause to the query.
     *
     * @param {Function} conditionBuilder
     */
    orWhere(conditionBuilder: SubCondition): this
    /**
     * Add an "or where" clause to the query.
     *
     * @param {string} field
     * @param {mixed} value
     */
    orWhere(field: string, value: any): this
    /**
     * Add an "or where" clause to the query.
     *
     * @param {string} field
     * @param {string} operator
     * @param {mixed} value
     */
    orWhere(field: string, operator: Operator, value: any): this
  }
}
