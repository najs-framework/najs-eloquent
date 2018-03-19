export type OrderDirection = 'asc' | 'desc'

export interface IBasicQuery {
  queryName(name: string): this

  setLogGroup(group: string): this

  select(field: string): this
  select(fields: string[]): this
  select(...fields: Array<string | string[]>): this

  distinct(field: string): this
  distinct(field: Array<string>): this
  distinct(...fields: Array<string>): this

  orderBy(field: string): this
  orderBy(field: string, direction: OrderDirection): this
  orderByAsc(field: string): this
  orderByDesc(field: string): this

  limit(record: number): this
}
