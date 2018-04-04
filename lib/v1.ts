import { Collection } from 'collect.js'
import { EloquentDriverProvider } from './facades/global/EloquentDriverProviderFacade'
import { MongooseDriver } from './drivers/MongooseDriver'
import { ChanceFaker, FactoryManager as FactoryManagerClass } from './factory/FactoryManager'
import { FactoryBuilder as FactoryBuilderClass } from './factory/FactoryBuilder'
import { FlipFlopQueryLog as FlipFlopQueryLogClass } from './log/FlipFlopQueryLog'
import { GenericQueryBuilder as GenericQueryBuilderClass } from './query-builders/GenericQueryBuilder'
import { GenericQueryCondition as GenericQueryConditionClass } from './query-builders/GenericQueryCondition'
import { BuiltinMongooseProvider } from './providers/BuiltinMongooseProvider'
import { DriverManager as DriverManagerClass } from './providers/DriverManager'
import { MongooseQueryLog as MongooseQueryLogClass } from './query-builders/mongodb/MongooseQueryLog'
import { MongodbConditionConverter as MongodbConditionConverterClass } from './query-builders/mongodb/MongodbConditionConverter'
import { MongooseQueryBuilder as MongooseQueryBuilderClass } from './query-builders/mongodb/MongooseQueryBuilder'
import { IQueryLog, IQueryLogTransform, IQueryLogItem } from './log/interfaces/IQueryLog'
import { IFactory } from './factory/interfaces/IFactory'
import { IFactoryBuilder, IFactoryBuilderCollection } from './factory/interfaces/IFactoryBuilder'
import { IFactoryManager } from './factory/interfaces/IFactoryManager'
import { IEloquentDriverProvider } from './providers/interfaces/IEloquentDriverProvider'
import { IBasicQuery } from './query-builders/interfaces/IBasicQuery'
import { IConditionQuery } from './query-builders/interfaces/IConditionQuery'

// Public classes ------------------------------------------------------------------------------------------------------
export type Faker = ChanceFaker
export { Collection }

export { Eloquent, Mongoose, EloquentMongoose } from './model/Eloquent'
export { NajsEloquentClass } from './constants'

export { IEloquentDriver } from './drivers/interfaces/IEloquentDriver'
export { MongooseDriver }

export { NotFoundError } from './errors/NotFoundError'

export { Seeder } from './seed/Seeder'

export { EloquentDriverProvider }
export { EloquentDriverProviderFacade } from './facades/global/EloquentDriverProviderFacade'
export { FactoryFacade, Factory, factory } from './facades/global/FactoryFacade'
export { MongooseProviderFacade, MongooseProvider } from './facades/global/MongooseProviderFacade'
export { QueryLogFacade, QueryLog } from './facades/global/QueryLogFacade'

export { IMongooseProvider } from './providers/interfaces/IMongooseProvider'

export { IFetchResultQuery } from './query-builders/interfaces/IFetchResultQuery'
export { IQueryConvention } from './query-builders/interfaces/IQueryConvention'
export { ISoftDeletesQuery } from './query-builders/interfaces/ISoftDeletesQuery'

// register mongoose driver as default driver
EloquentDriverProvider.register(MongooseDriver, 'mongoose', true)

// Builtin classes and contracts ---------------------------------------------------------------------------------------

export namespace NajsEloquent {
  export namespace Builtin {
    export const FactoryManager: typeof FactoryManagerClass = FactoryManagerClass
    export const FactoryBuilder: typeof FactoryBuilderClass = FactoryBuilderClass

    export const FlipFlopQueryLog: typeof FlipFlopQueryLogClass = FlipFlopQueryLogClass

    export const GenericQueryBuilder: typeof GenericQueryBuilderClass = GenericQueryBuilderClass
    export const GenericQueryCondition: typeof GenericQueryConditionClass = GenericQueryConditionClass
    export const MongodbConditionConverter: typeof MongodbConditionConverterClass = MongodbConditionConverterClass
    export const MongooseQueryBuilder: typeof MongooseQueryBuilderClass = MongooseQueryBuilderClass
    export const MongooseQueryLog: typeof MongooseQueryLogClass = MongooseQueryLogClass

    export const MongooseProvider: typeof BuiltinMongooseProvider = BuiltinMongooseProvider
    export const DriverManager: typeof DriverManagerClass = DriverManagerClass
  }

  export namespace Contracts {
    export namespace Factory {
      export interface Factory<T> extends IFactory<T> {}
      export interface FactoryBuilder<T> extends IFactoryBuilder<T> {}
      export interface FactoryBuilderCollection<T> extends IFactoryBuilderCollection<T> {}
      export interface FactoryManager<T> extends IFactoryManager<T> {}
    }

    export namespace QueryBuilder {
      export interface BasicQuery extends IBasicQuery {}
      export interface ConditionQuery extends IConditionQuery {}
    }

    export namespace Provider {
      export interface EloquentDriverProvider extends IEloquentDriverProvider {}
    }

    export namespace Driver {

    }

    export namespace Log {
      export interface QueryLogTransform extends IQueryLogTransform {}
      export interface QueryLogItem extends IQueryLogItem {}
      export interface QueryLog extends IQueryLog {}
    }
  }
}
