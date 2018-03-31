import {
  IQueryLog,
  QueryLogTransform as QueryLogTransformType,
  QueryLogItem as QueryLogItemType
} from './log/interfaces/IQueryLog'
import { Collection } from 'collect.js'
import { ChanceFaker } from './factory/FactoryManager'
import { EloquentDriverProvider } from './facades/global/EloquentDriverProviderFacade'
import { MongooseDriver } from './drivers/MongooseDriver'

export type Faker = ChanceFaker
export { Collection }

export { Eloquent, Mongoose, EloquentMongoose } from './model/Eloquent'
export { EloquentAttribute } from './model/EloquentAttribute'
export { EloquentMetadata } from './model/EloquentMetadata'
export { EloquentProxy } from './model/EloquentProxy'

export { IEloquentDriver } from './drivers/interfaces/IEloquentDriver'
export { DummyDriver } from './drivers/DummyDriver'
export { MongooseDriver }
export { SoftDelete } from './drivers/mongoose/SoftDelete'

export { NotFoundError } from './errors/NotFoundError'

export { EloquentDriverProviderFacade } from './facades/global/EloquentDriverProviderFacade'
export { EloquentDriverProvider }
export { FactoryFacade, Factory, factory } from './facades/global/FactoryFacade'
export { MongooseProviderFacade, MongooseProvider } from './facades/global/MongooseProviderFacade'
export { QueryLogFacade, QueryLog } from './facades/global/QueryLogFacade'

export { IFactory } from './factory/interfaces/IFactory'
export { IFactoryBuilder } from './factory/interfaces/IFactoryBuilder'
export { IFactoryManager } from './factory/interfaces/IFactoryManager'
export { FactoryBuilder } from './factory/FactoryBuilder'
export { FactoryManager } from './factory/FactoryManager'

export { FlipFlopQueryLog } from './log/FlipFlopQueryLog'

export { IEloquentDriverProvider } from './providers/interfaces/IEloquentDriverProvider'
export { IMongooseProvider } from './providers/interfaces/IMongooseProvider'
export { BuiltinMongooseProvider } from './providers/BuiltinMongooseProvider'
export { DriverManager } from './providers/DriverManager'

export { IBasicQuery } from './query-builders/interfaces/IBasicQuery'
export { IConditionQuery } from './query-builders/interfaces/IConditionQuery'
export { IFetchResultQuery } from './query-builders/interfaces/IFetchResultQuery'
export { IQueryConvention } from './query-builders/interfaces/IQueryConvention'
export { ISoftDeletesQuery } from './query-builders/interfaces/ISoftDeletesQuery'
export { MongodbConditionConverter } from './query-builders/mongodb/MongodbConditionConverter'
export { MongooseQueryBuilder } from './query-builders/mongodb/MongooseQueryBuilder'
export { MongooseQueryLog } from './query-builders/mongodb/MongooseQueryLog'
export { GenericQueryBuilder } from './query-builders/GenericQueryBuilder'
export { GenericQueryCondition } from './query-builders/GenericQueryCondition'

export { Seeder } from './seed/Seeder'

// register mongoose driver as default driver
EloquentDriverProvider.register(MongooseDriver, 'mongoose', true)

export namespace NajsEloquent {
  // export namespace Builtin {
  //   export const FactoryManager: typeof FactoryManagerClass = FactoryManagerClass
  // }

  export namespace Contracts {
    export namespace Log {
      export type QueryLogTransform = QueryLogTransformType
      export type QueryLogItem = QueryLogItemType

      export interface QueryLog extends IQueryLog {}
    }
  }
}
