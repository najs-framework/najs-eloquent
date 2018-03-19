export type Operator = '=' | '==' | '!=' | '<>' | '<' | '<=' | '=<' | '>' | '>=' | '=>' | 'in' | 'not-in'
export type SubCondition = (query: IConditionQuery) => any

export interface IConditionQuery {
  where(conditionBuilder: SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: Operator, value: any): this

  orWhere(conditionBuilder: SubCondition): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: Operator, value: any): this

  whereIn(field: string, values: Array<any>): this
  whereNotIn(field: string, values: Array<any>): this

  orWhereIn(field: string, values: Array<any>): this
  orWhereNotIn(field: string, values: Array<any>): this

  whereNull(field: string): this
  whereNotNull(field: string): this

  orWhereNull(field: string): this
  orWhereNotNull(field: string): this
}
