/// <reference path="collect.js/index.d.ts" />
/// <reference path="contracts/Driver.ts" />
/// <reference path="contracts/DriverProvider.ts" />
/// <reference path="contracts/Component.ts" />
/// <reference path="contracts/ComponentProvider.ts" />
/// <reference path="contracts/QueryLog.ts" />
/// <reference path="contracts/MongooseProvider.ts" />
/// <reference path="model/interfaces/IModel.ts" />
/// <reference path="model/interfaces/IModelQuery.ts" />

import { BuiltinClasses } from './builtin'
import { container as FacadeContainer } from './facades/container'
import { ModelAttribute } from './model/components/ModelAttribute'
import { ModelFillable } from './model/components/ModelFillable'
import { ModelSerialization } from './model/components/ModelSerialization'
import { ModelQuery } from './model/components/ModelQuery'
import { ModelTimestamps } from './model/components/ModelTimestamps'
import { ModelSoftDeletes } from './model/components/ModelSoftDeletes'
import { ModelActiveRecord } from './model/components/ModelActiveRecord'
import { ModelSetting } from './model/components/ModelSetting'
import { DynamicAttribute } from './model/components/DynamicAttribute'
import { StaticQuery } from './model/components/StaticQuery'
import { DriverProvider } from './providers/DriverProvider'
import { ComponentProvider } from './providers/ComponentProvider'
import { MongooseProvider as MongooseProviderClass } from './providers/MongooseProvider'
import { ChanceFaker } from './factory/FactoryManager'
import { EloquentDriverProvider } from './facades/global/EloquentDriverProviderFacade'
import { MongooseDriver } from './drivers/MongooseDriver'
import { GenericQueryBuilder } from './query-builders/GenericQueryBuilder'
import { MongodbConditionConverter } from './query-builders/mongodb/MongodbConditionConverter'
import { MongooseQueryBuilder } from './query-builders/mongodb/MongooseQueryBuilder'
import { MongooseQueryLog } from './query-builders/mongodb/MongooseQueryLog'
import { QueryBuilderWrapper } from './wrappers/QueryBuilderWrapper'
import { MongooseQueryBuilderWrapper } from './wrappers/MongooseQueryBuilderWrapper'

export type Faker = ChanceFaker
export type Model<T> = NajsEloquent.Model.IModel<T> & T
export type ModelAsync<T> = Promise<NajsEloquent.Model.IModel<T> & T>
export type Collection<T> = CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>
export type CollectionAsync<T> = Promise<CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>>

// package facades
export { QueryLogFacade, QueryLog } from './facades/global/QueryLogFacade'
export { EloquentDriverProviderFacade, EloquentDriverProvider } from './facades/global/EloquentDriverProviderFacade'
export {
  EloquentComponentProviderFacade,
  EloquentComponentProvider
} from './facades/global/EloquentComponentProviderFacade'
export { MongooseProviderFacade, MongooseProvider } from './facades/global/MongooseProviderFacade'
export { FactoryFacade, Factory, factory } from './facades/global/FactoryFacade'

// package error
export { NotFoundError } from './errors/NotFoundError'

// package model
export { Eloquent, EloquentStaticMongoose } from './model/Eloquent'
export { EloquentMongoose } from './model/EloquentMongoose'

// package driver
export { DummyDriver } from './drivers/DummyDriver'
export { MongooseDriver } from './drivers/MongooseDriver'
EloquentDriverProvider.register(MongooseDriver, 'mongoose', true)

export const NajsEloquent: BuiltinClasses = {
  FacadeContainer: FacadeContainer,
  Model: {
    Component: {
      ModelAttribute: ModelAttribute,
      ModelFillable: ModelFillable,
      ModelSerialization: ModelSerialization,
      ModelQuery: ModelQuery,
      ModelTimestamps: ModelTimestamps,
      ModelSoftDeletes: ModelSoftDeletes,
      ModelActiveRecord: ModelActiveRecord,
      ModelSetting: ModelSetting,
      DynamicAttribute: DynamicAttribute,
      StaticQuery: StaticQuery
    }
  },
  Provider: {
    DriverProvider: DriverProvider,
    ComponentProvider: ComponentProvider,
    MongooseProvider: MongooseProviderClass
  },
  QueryBuilder: {
    GenericQueryBuilder: GenericQueryBuilder,
    Mongodb: {
      MongodbConditionConverter: MongodbConditionConverter,
      MongooseQueryBuilder: MongooseQueryBuilder,
      MongooseQueryLog: MongooseQueryLog
    }
  },
  Wrapper: {
    QueryBuilderWrapper: QueryBuilderWrapper,
    MongooseQueryBuilderWrapper: MongooseQueryBuilderWrapper
  }
}
