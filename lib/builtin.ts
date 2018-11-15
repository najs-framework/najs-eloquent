// package: Data
import { DataBuffer } from './data/DataBuffer'
import { DataCollector } from './data/DataCollector'
import { DataConditionMatcher } from './data/DataConditionMatcher'

// package: Driver
import { DriverBase } from './drivers/DriverBase'
import { QueryLogBase } from './drivers/QueryLogBase'
import { ExecutorBase } from './drivers/ExecutorBase'
import { Record } from './drivers/Record'
import { RecordConditionMatcher } from './drivers/RecordConditionMatcher'
import { RecordConditionMatcherFactory } from './drivers/RecordConditionMatcherFactory'
import { RecordDataReader } from './drivers/RecordDataReader'
import { RecordDataSourceBase } from './drivers/RecordDataSourceBase'
import { RecordExecutorBase } from './drivers/RecordExecutorBase'
import { RecordManager } from './drivers/RecordManager'
import { RecordManagerBase } from './drivers/RecordManagerBase'

// package: Driver/Memory
import { MemoryDataSource } from './drivers/memory/MemoryDataSource'
import { MemoryDriver } from './drivers/memory/MemoryDriver'
import { MemoryExecutorFactory } from './drivers/memory/MemoryExecutorFactory'
import { MemoryQueryBuilder } from './drivers/memory/MemoryQueryBuilder'
import { MemoryQueryBuilderHandler } from './drivers/memory/MemoryQueryBuilderHandler'
import { MemoryQueryBuilderFactory } from './drivers/memory/MemoryQueryBuilderFactory'
import { MemoryQueryExecutor } from './drivers/memory/MemoryQueryExecutor'
import { MemoryQueryLog } from './drivers/memory/MemoryQueryLog'
import { MemoryRecordExecutor } from './drivers/memory/MemoryRecordExecutor'

// package: Error
import { NotFoundError } from './errors/NotFoundError'
import { RelationNotDefinedError } from './errors/RelationNotDefinedError'
import { RelationNotFoundInNewInstanceError } from './errors/RelationNotFoundInNewInstanceError'

// package: Factory
import { FactoryBuilder } from './factory/FactoryBuilder'
import { FactoryManager } from './factory/FactoryManager'

// package: Feature
import { EventFeature } from './features/EventFeature'
import { FeatureBase } from './features/FeatureBase'
import { FillableFeature } from './features/FillableFeature'
import { QueryFeature } from './features/QueryFeature'
import { RelationFeature } from './features/RelationFeature'
import { SerializationFeature } from './features/SerializationFeature'
import { SettingFeature } from './features/SettingFeature'
import { SoftDeletesFeature } from './features/SoftDeletesFeature'
import { TimestampsFeature } from './features/TimestampsFeature'

// package: Feature/Mixin
import { EventPublicApi } from './features/mixin/EventPublicApi'
import { FillablePublicApi } from './features/mixin/FillablePublicApi'
import { RecordManagerPublicApi } from './features/mixin/RecordManagerPublicApi'
import { RelationPublicApi } from './features/mixin/RelationPublicApi'
import { SerializationPublicApi } from './features/mixin/SerializationPublicApi'
import { SoftDeletesPublicApi } from './features/mixin/SoftDeletesPublicApi'
import { TimestampsPublicApi } from './features/mixin/TimestampsPublicApi'

// package Provider
import { DriverProvider } from './providers/DriverProvider'
import { MemoryDataSourceProvider } from './providers/MemoryDataSourceProvider'

// package QueryBuilder
import { QueryBuilder } from './query-builders/QueryBuilder'
import { QueryBuilderHandlerBase } from './query-builders/QueryBuilderHandlerBase'

// package QueryBuilder/Mixin
import { AdvancedQuery } from './query-builders/mixin/AdvancedQuery'
import { ConditionQuery } from './query-builders/mixin/ConditionQuery'
import { ExecuteQuery } from './query-builders/mixin/ExecuteQuery'
import { Query } from './query-builders/mixin/Query'

// package QueryBuilder/Shared
import { BasicQuery } from './query-builders/shared/BasicQuery'
import { BasicQueryConverter } from './query-builders/shared/BasicQueryConverter'
import { ConditionQueryHandler } from './query-builders/shared/ConditionQueryHandler'
import { DefaultConvention } from './query-builders/shared/DefaultConvention'
import { ExecutorUtils } from './query-builders/shared/ExecutorUtils'
import { Operator } from './query-builders/shared/Operator'
import { QueryCondition } from './query-builders/shared/QueryCondition'

// package QueryLog
import { FlipFlopQueryLog } from './query-log/FlipFlopQueryLog'

// package Relation
// import { Relation } from './relations/Relation'
// import { RelationData } from './relations/RelationData'
// import { RelationDataBucket } from './relations/RelationDataBucket'
// import { RelationDefinitionFinder } from './relations/RelationDefinitionFinder'
// import { RelationFactory } from './relations/RelationFactory'
// import { RelationUtilities } from './relations/RelationUtilities'
// import { HasOneRelation } from './relations/basic/HasOneRelation'

// package Util
import { ClassSetting } from './util/ClassSetting'
import { PrototypeManager } from './util/PrototypeManager'
import { SettingType } from './util/SettingType'

export type DataPackage = {
  DataBuffer: typeof DataBuffer
  DataCollector: typeof DataCollector
  DataConditionMatcher: typeof DataConditionMatcher
}

export type DriverPackage = {
  DriverBase: typeof DriverBase
  ExecutorBase: typeof ExecutorBase
  QueryLogBase: typeof QueryLogBase
  Record: typeof Record
  RecordConditionMatcher: typeof RecordConditionMatcher
  RecordConditionMatcherFactory: typeof RecordConditionMatcherFactory
  RecordDataReader: typeof RecordDataReader
  RecordDataSourceBase: typeof RecordDataSourceBase
  RecordExecutorBase: typeof RecordExecutorBase
  RecordManager: typeof RecordManager
  RecordManagerBase: typeof RecordManagerBase

  Memory: DriverMemoryPackage
}

export type DriverMemoryPackage = {
  MemoryDataSource: typeof MemoryDataSource
  MemoryDriver: typeof MemoryDriver
  MemoryExecutorFactory: typeof MemoryExecutorFactory
  MemoryQueryBuilder: typeof MemoryQueryBuilder
  MemoryQueryBuilderHandler: typeof MemoryQueryBuilderHandler
  MemoryQueryBuilderFactory: typeof MemoryQueryBuilderFactory
  MemoryQueryExecutor: typeof MemoryQueryExecutor
  MemoryQueryLog: typeof MemoryQueryLog
  MemoryRecordExecutor: typeof MemoryRecordExecutor
}

export type ErrorPackage = {
  NotFoundError: typeof NotFoundError
  RelationNotDefinedError: typeof RelationNotDefinedError
  RelationNotFoundInNewInstanceError: typeof RelationNotFoundInNewInstanceError
}

export type FactoryPackage = {
  FactoryBuilder: typeof FactoryBuilder
  FactoryManager: typeof FactoryManager
}

export type FeaturePackage = {
  EventFeature: typeof EventFeature
  FeatureBase: typeof FeatureBase
  FillableFeature: typeof FillableFeature
  QueryFeature: typeof QueryFeature
  RelationFeature: typeof RelationFeature
  SerializationFeature: typeof SerializationFeature
  SettingFeature: typeof SettingFeature
  SoftDeletesFeature: typeof SoftDeletesFeature
  TimestampsFeature: typeof TimestampsFeature

  Mixin: FeatureMixinPackage
}

export type FeatureMixinPackage = {
  EventPublicApi: typeof EventPublicApi
  FillablePublicApi: typeof FillablePublicApi
  RecordManagerPublicApi: typeof RecordManagerPublicApi
  RelationPublicApi: typeof RelationPublicApi
  SerializationPublicApi: typeof SerializationPublicApi
  SoftDeletesPublicApi: typeof SoftDeletesPublicApi
  TimestampsPublicApi: typeof TimestampsPublicApi
}

export type ProviderPackage = {
  DriverProvider: typeof DriverProvider
  MemoryDataSourceProvider: typeof MemoryDataSourceProvider
}

export type QueryBuilderPackage = {
  QueryBuilder: typeof QueryBuilder
  QueryBuilderHandlerBase: typeof QueryBuilderHandlerBase

  Mixin: QueryBuilderMixinPackage
  Shared: QueryBuilderSharedPackage
}

export type QueryBuilderMixinPackage = {
  AdvancedQuery: typeof AdvancedQuery
  ConditionQuery: typeof ConditionQuery
  ExecuteQuery: typeof ExecuteQuery
  Query: typeof Query
}

export type QueryBuilderSharedPackage = {
  BasicQuery: typeof BasicQuery
  BasicQueryConverter: typeof BasicQueryConverter
  ConditionQueryHandler: typeof ConditionQueryHandler
  DefaultConvention: typeof DefaultConvention
  ExecutorUtils: typeof ExecutorUtils
  Operator: typeof Operator
  QueryCondition: typeof QueryCondition
}

export type QueryLogPackage = {
  FlipFlopQueryLog: typeof FlipFlopQueryLog
}

// export type RelationPackage = {
//   Relation: typeof Relation
//   RelationData: typeof RelationData
//   RelationDataBucket: typeof RelationDataBucket
//   RelationDefinitionFinder: typeof RelationDefinitionFinder
//   RelationFactory: typeof RelationFactory
//   RelationUtilities: typeof RelationUtilities
//   HasOneRelation: typeof HasOneRelation
// }

export type UtilPackage = {
  ClassSetting: typeof ClassSetting
  PrototypeManager: typeof PrototypeManager
  SettingType: typeof SettingType
}

export const Builtin: {
  Data: DataPackage
  Driver: DriverPackage
  Error: ErrorPackage
  Factory: FactoryPackage
  Feature: FeaturePackage
  Provider: ProviderPackage
  QueryBuilder: QueryBuilderPackage
  QueryLog: QueryLogPackage
  // Relation: RelationPackage
  Util: UtilPackage
} = {
  Data: {
    DataBuffer: DataBuffer,
    DataCollector: DataCollector,
    DataConditionMatcher: DataConditionMatcher
  },

  Driver: {
    DriverBase: DriverBase,
    ExecutorBase: ExecutorBase,
    QueryLogBase: QueryLogBase,
    Record: Record,
    RecordConditionMatcher: RecordConditionMatcher,
    RecordConditionMatcherFactory: RecordConditionMatcherFactory,
    RecordDataReader: RecordDataReader,
    RecordDataSourceBase: RecordDataSourceBase,
    RecordExecutorBase: RecordExecutorBase,
    RecordManager: RecordManager,
    RecordManagerBase: RecordManagerBase,

    Memory: {
      MemoryDataSource: MemoryDataSource,
      MemoryDriver: MemoryDriver,
      MemoryExecutorFactory: MemoryExecutorFactory,
      MemoryQueryBuilder: MemoryQueryBuilder,
      MemoryQueryBuilderHandler: MemoryQueryBuilderHandler,
      MemoryQueryBuilderFactory: MemoryQueryBuilderFactory,
      MemoryQueryExecutor: MemoryQueryExecutor,
      MemoryQueryLog: MemoryQueryLog,
      MemoryRecordExecutor: MemoryRecordExecutor
    }
  },

  Error: {
    NotFoundError: NotFoundError,
    RelationNotDefinedError: RelationNotDefinedError,
    RelationNotFoundInNewInstanceError: RelationNotFoundInNewInstanceError
  },

  Factory: {
    FactoryBuilder: FactoryBuilder,
    FactoryManager: FactoryManager
  },

  Feature: {
    EventFeature: EventFeature,
    FeatureBase: FeatureBase,
    FillableFeature: FillableFeature,
    QueryFeature: QueryFeature,
    RelationFeature: RelationFeature,
    SerializationFeature: SerializationFeature,
    SettingFeature: SettingFeature,
    SoftDeletesFeature: SoftDeletesFeature,
    TimestampsFeature: TimestampsFeature,

    Mixin: {
      EventPublicApi: EventPublicApi,
      FillablePublicApi: FillablePublicApi,
      RecordManagerPublicApi: RecordManagerPublicApi,
      RelationPublicApi: RelationPublicApi,
      SerializationPublicApi: SerializationPublicApi,
      SoftDeletesPublicApi: SoftDeletesPublicApi,
      TimestampsPublicApi: TimestampsPublicApi
    }
  },

  Provider: {
    DriverProvider: DriverProvider,
    MemoryDataSourceProvider: MemoryDataSourceProvider
  },

  QueryBuilder: {
    QueryBuilder: QueryBuilder,
    QueryBuilderHandlerBase: QueryBuilderHandlerBase,

    Mixin: {
      AdvancedQuery: AdvancedQuery,
      ConditionQuery: ConditionQuery,
      ExecuteQuery: ExecuteQuery,
      Query: Query
    },

    Shared: {
      BasicQuery: BasicQuery,
      BasicQueryConverter: BasicQueryConverter,
      ConditionQueryHandler: ConditionQueryHandler,
      DefaultConvention: DefaultConvention,
      ExecutorUtils: ExecutorUtils,
      Operator: Operator,
      QueryCondition: QueryCondition
    }
  },

  QueryLog: {
    FlipFlopQueryLog: FlipFlopQueryLog
  },

  // Relation: {
  //   Relation: Relation,
  //   RelationData: RelationData,
  //   RelationDataBucket: RelationDataBucket,
  //   RelationDefinitionFinder: RelationDefinitionFinder,
  //   RelationFactory: RelationFactory,
  //   RelationUtilities: RelationUtilities,
  //   HasOneRelation: HasOneRelation
  // },

  Util: {
    ClassSetting: ClassSetting,
    PrototypeManager: PrototypeManager,
    SettingType: SettingType
  }
}
