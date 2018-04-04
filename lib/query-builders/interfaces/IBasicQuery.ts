export type OrderDirection = 'asc' | 'desc'

export interface IBasicQuery {
  /**
   * Set the query with given name
   * @param {string} name
   */
  queryName(name: string): this

  /**
   * Get the primary key name
   */
  getPrimaryKey(): string

  /**
   * Set the query log group name
   *
   * @param {string} group QueryLog group
   */
  setLogGroup(group: string): this

  /**
   * Set the columns or fields to be selected.
   *
   * @param {string|string[]} fields
   */
  select(field: string): this
  /**
   * Set the columns or fields to be selected.
   *
   * @param {string|string[]} fields
   */
  select(fields: string[]): this
  /**
   * Set the columns or fields to be selected.
   *
   * @param {string|string[]} fields
   */
  select(...fields: Array<string | string[]>): this

  // distinct(field: string): this
  // distinct(field: Array<string>): this
  // distinct(...fields: Array<string>): this

  /**
   * Add an "order by" clause to the query.
   *
   * @param {string} field
   */
  orderBy(field: string): this
  /**
   * Add an "order by" clause to the query.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderBy(field: string, direction: OrderDirection): this

  /**
   * Add an "order by" clause to the query with direction ASC.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderByAsc(field: string): this

  /**
   * Add an "order by" clause to the query with direction DESC.
   *
   * @param {string} field
   * @param {string} direction
   */
  orderByDesc(field: string): this

  /**
   * Set the "limit" value of the query.
   * @param {number} records
   */
  limit(record: number): this
}
