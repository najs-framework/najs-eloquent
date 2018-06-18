export abstract class QueryBuilderBase {
  static DefaultConvention: NajsEloquent.QueryBuilder.IQueryConvention = {
    formatFieldName(name: any) {
      return name
    },
    getNullValueFor(name: any) {
      // tslint:disable-next-line
      return null
    }
  }

  protected name: string
  protected logGroup: string
  protected isUsed: boolean
  protected primaryKeyName: string
  protected convention: NajsEloquent.QueryBuilder.IQueryConvention

  constructor(primaryKeyName?: string) {
    this.primaryKeyName = primaryKeyName || 'id'
    this.isUsed = false
    this.convention = this.getQueryConvention()
  }

  abstract orderBy(field: string, direction?: string): this

  protected getQueryConvention(): NajsEloquent.QueryBuilder.IQueryConvention {
    return QueryBuilderBase.DefaultConvention
  }

  queryName(name: string): this {
    this.name = name

    return this
  }

  setLogGroup(group: string): this {
    this.logGroup = group

    return this
  }

  getPrimaryKeyName(): string {
    return this.convention.formatFieldName(this.primaryKeyName)
  }

  orderByAsc(field: string): this {
    return this.orderBy(field, 'asc')
  }

  orderByDesc(field: string): this {
    return this.orderBy(field, 'desc')
  }
}
