/// <reference path="../../definitions/query-builders/IConvention.ts" />

export class DefaultConvention implements NajsEloquent.QueryBuilder.IConvention {
  formatFieldName(name: any) {
    return name
  }

  getNullValueFor(name: any) {
    // tslint:disable-next-line
    return null
  }
}
