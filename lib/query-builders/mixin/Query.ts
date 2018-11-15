/// <reference path="../../definitions/query-grammars/IQuery.ts" />
import QueryBuilder = NajsEloquent.QueryBuilder.QueryBuilderInternal

export const Query: NajsEloquent.QueryGrammar.IQuery = {
  select(this: QueryBuilder, ...fields: Array<string | string[]>) {
    this.handler.getBasicQuery().select(...fields)
    this.handler.markUsed()

    return this
  },

  limit(this: QueryBuilder, record: number) {
    this.handler.getBasicQuery().limit(record)
    this.handler.markUsed()

    return this
  },

  orderBy(this: QueryBuilder, field: string, direction?: 'asc' | 'desc') {
    this.handler.getBasicQuery().orderBy(field, direction!)
    this.handler.markUsed()

    return this
  },

  queryName(this: QueryBuilder, name: string) {
    this.handler.setQueryName(name)
    this.handler.markUsed()

    return this
  },

  setLogGroup(this: QueryBuilder, group: string) {
    this.handler.setLogGroup(group)
    this.handler.markUsed()

    return this
  },

  orderByAsc(this: QueryBuilder, field: string) {
    return this.orderBy(field, 'asc')
  },

  orderByDesc(this: QueryBuilder, field: string) {
    return this.orderBy(field, 'desc')
  },

  withTrashed(this: QueryBuilder) {
    if (this.handler.hasSoftDeletes()) {
      this.handler.markSoftDeleteState('should-not-add')
      this.handler.markUsed()
    }

    return this
  },

  onlyTrashed(this: QueryBuilder) {
    if (this.handler.hasSoftDeletes()) {
      this.handler.markSoftDeleteState('should-not-add')
      this.whereNotNull(this.handler.getSoftDeletesSetting().deletedAt)
      this.handler.markUsed()
    }

    return this
  }
}
