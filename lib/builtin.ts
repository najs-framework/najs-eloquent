import { IFacadeContainer } from 'najs-facade'
import { ModelAttribute } from './model/components/ModelAttribute'
import { ModelFillable } from './model/components/ModelFillable'
import { ModelSerialization } from './model/components/ModelSerialization'
import { ModelQuery } from './model/components/ModelQuery'
import { ModelTimestamps } from './model/components/ModelTimestamps'
import { ModelSoftDeletes } from './model/components/ModelSoftDeletes'
import { ModelActiveRecord } from './model/components/ModelActiveRecord'
import { ModelSetting } from './model/components/ModelSetting'
import { StaticQuery } from './model/components/StaticQuery'
import { DynamicAttribute } from './model/components/DynamicAttribute'
import { DriverProvider } from './providers/DriverProvider'
import { ComponentProvider } from './providers/ComponentProvider'
import { KnexProvider } from './providers/KnexProvider'
import { MongodbProvider } from './providers/MongodbProvider'
import { MongooseProvider } from './providers/MongooseProvider'
import { GenericQueryBuilder } from './query-builders/GenericQueryBuilder'
import { MongodbConditionConverter } from './query-builders/mongodb/MongodbConditionConverter'
import { MongooseQueryBuilder } from './query-builders/mongodb/MongooseQueryBuilder'
import { MongodbQueryLog } from './query-builders/mongodb/MongodbQueryLog'
import { QueryBuilderWrapper } from './wrappers/QueryBuilderWrapper'
import { MongooseQueryBuilderWrapper } from './wrappers/MongooseQueryBuilderWrapper'
import { MongodbQueryBuilderWrapper } from './wrappers/MongodbQueryBuilderWrapper'
import { MongodbQueryBuilder } from './query-builders/mongodb/MongodbQueryBuilder'

export type BuiltinClasses = {
  FacadeContainer: IFacadeContainer
  Model: {
    Component: {
      ModelAttribute: typeof ModelAttribute
      ModelFillable: typeof ModelFillable
      ModelSerialization: typeof ModelSerialization
      ModelQuery: typeof ModelQuery
      ModelTimestamps: typeof ModelTimestamps
      ModelSoftDeletes: typeof ModelSoftDeletes
      ModelActiveRecord: typeof ModelActiveRecord
      ModelSetting: typeof ModelSetting
      DynamicAttribute: typeof DynamicAttribute
      StaticQuery: typeof StaticQuery
    }
  }
  Provider: {
    DriverProvider: typeof DriverProvider
    ComponentProvider: typeof ComponentProvider
    KnexProvider: typeof KnexProvider
    MongodbProvider: typeof MongodbProvider
    MongooseProvider: typeof MongooseProvider
  }
  QueryBuilder: {
    GenericQueryBuilder: typeof GenericQueryBuilder
    Mongodb: {
      MongodbConditionConverter: typeof MongodbConditionConverter
      MongodbQueryBuilder: typeof MongodbQueryBuilder
      MongooseQueryBuilder: typeof MongooseQueryBuilder
      MongodbQueryLog: typeof MongodbQueryLog
    }
  }
  Wrapper: {
    QueryBuilderWrapper: typeof QueryBuilderWrapper
    MongodbQueryBuilderWrapper: typeof MongodbQueryBuilderWrapper
    MongooseQueryBuilderWrapper: typeof MongooseQueryBuilderWrapper
  }
}
