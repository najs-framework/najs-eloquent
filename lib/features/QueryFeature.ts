/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilderFactory.ts" />
/// <reference path="../definitions/features/IQueryFeature.ts" />

import { register } from 'najs-binding'
import { FeatureBase } from './FeatureBase'
import { NajsEloquent } from '../constants'

export class QueryFeature extends FeatureBase implements NajsEloquent.Feature.IQueryFeature {
  protected factory: NajsEloquent.QueryBuilder.IQueryBuilderFactory

  constructor(factory: NajsEloquent.QueryBuilder.IQueryBuilderFactory) {
    super()
    this.factory = factory
  }

  getPublicApi(): object | undefined {
    return undefined
  }

  getFeatureName(): string {
    return 'Query'
  }

  getClassName(): string {
    return NajsEloquent.Feature.QueryFeature
  }

  newQuery(model: NajsEloquent.Model.IModel): NajsEloquent.QueryBuilder.IQueryBuilder<any> {
    const queryBuilder = this.factory.make(model) as NajsEloquent.QueryBuilder.QueryBuilderInternal
    const executeMode = this.useSettingFeatureOf(model).getSettingProperty(model, 'executeMode', 'default')
    if (executeMode !== 'default') {
      queryBuilder.handler.getQueryExecutor().setExecuteMode(executeMode)
    }
    return queryBuilder
  }
}
register(QueryFeature, NajsEloquent.Feature.QueryFeature)
