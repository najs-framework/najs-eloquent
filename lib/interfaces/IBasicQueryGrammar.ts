type NativeQueryHandler = (native: any) => void
type OrderDirection = 'asc' | 'desc'
type Operator = '=' | '!=' | '<' | '<=' | '=<' | '>' | '>=' | '=>'

export interface IBasicQueryGrammar {
  native(handler: NativeQueryHandler): this

  select(field: string): this
  select(fields: Array<string>): this
  select(...fields: Array<string>): this

  distinct(field: string): this
  distinct(field: Array<string>): this
  distinct(...fields: Array<string>): this

  orderBy(field: string, direction: OrderDirection): this
  orderByDesc(field: string): this

  where(conditions: Object): this
  where(field: string, value: any): this
  where(field: string, operator: Operator, value: any): this

  orWhere(conditions: Object): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: Operator, value: any): this

  whereNot(conditions: Object): this
  whereNot(field: string, value: any): this
  whereNot(field: string, operator: Operator, value: any): this

  orWhereNot(conditions: Object): this
  orWhereNot(field: string, value: any): this
  orWhereNot(field: string, operator: Operator, value: any): this

  whereIn(field: string, values: Array<any>): this

  orWhereIn(field: string, values: Array<any>): this

  whereNotIn(field: string, values: Array<any>): this

  orWhereNotIn(field: string, values: Array<any>): this
}
