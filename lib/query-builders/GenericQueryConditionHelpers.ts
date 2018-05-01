/// <reference path="interfaces/IQueryConvention.ts" />

export interface GenericQueryConditionHelpers {
  convention: NajsEloquent.QueryBuilder.IQueryConvention
  where(subQuery: (subQuery: GenericQueryConditionHelpers) => void): any
  where(field: string, operator: string, value: any): any
  orWhere(subQuery: (subQuery: GenericQueryConditionHelpers) => void): any
  orWhere(field: string, operator: string, value: any): any
}

export class GenericQueryConditionHelpers {
  andWhere(arg0: any, arg1?: any, arg2?: any): this {
    return this.where(arg0, arg1, arg2)
  }

  whereNot(field: string, values: any): this {
    return this.where(field, '<>', values)
  }

  andWhereNot(field: string, values: any): this {
    return this.whereNot(field, values)
  }

  orWhereNot(field: string, values: any): this {
    return this.orWhere(field, '<>', values)
  }

  whereIn(field: string, values: Array<any>): this {
    return this.where(field, 'in', values)
  }

  andWhereIn(field: string, values: Array<any>): this {
    return this.whereIn(field, values)
  }

  orWhereIn(field: string, values: Array<any>): this {
    return this.orWhere(field, 'in', values)
  }

  whereNotIn(field: string, values: Array<any>): this {
    return this.where(field, 'not-in', values)
  }

  andWhereNotIn(field: string, values: Array<any>): this {
    return this.whereNotIn(field, values)
  }

  orWhereNotIn(field: string, values: Array<any>): this {
    return this.orWhere(field, 'not-in', values)
  }

  whereNull(field: string) {
    return this.where(field, '=', this.convention.getNullValueFor(field))
  }

  andWhereNull(field: string) {
    return this.whereNull(field)
  }

  orWhereNull(field: string) {
    return this.orWhere(field, '=', this.convention.getNullValueFor(field))
  }

  whereNotNull(field: string) {
    return this.where(field, '<>', this.convention.getNullValueFor(field))
  }

  andWhereNotNull(field: string) {
    return this.whereNotNull(field)
  }

  orWhereNotNull(field: string) {
    return this.orWhere(field, '<>', this.convention.getNullValueFor(field))
  }

  whereBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this {
    return this.where(field, '>=', range[0]).where(field, '<=', range[1])
  }

  andWhereBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this {
    return this.whereBetween(field, range)
  }

  orWhereBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this {
    return this.orWhere(function(subQuery) {
      subQuery.where(field, '>=', range[0]).where(field, '<=', range[1])
    })
  }

  whereNotBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this {
    return this.where(function(subQuery) {
      subQuery.where(field, '<', range[0]).orWhere(field, '>', range[1])
    })
  }

  andWhereNotBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this {
    return this.whereNotBetween(field, range)
  }

  orWhereNotBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this {
    return this.orWhere(function(subQuery) {
      subQuery.where(field, '<', range[0]).orWhere(field, '>', range[1])
    })
  }

  static get FUNCTIONS(): string[] {
    return Object.getOwnPropertyNames(GenericQueryConditionHelpers.prototype).filter(item => item !== 'constructor')
  }
}
