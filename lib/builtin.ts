// Used definitions
import { Model } from './model/Model'

// ---------------------------------------------------------------------------------------------------------------------
// package: Data
import { DataBuffer as DataBufferClass } from './data/DataBuffer'
import { DataCollector as DataCollectorClass } from './data/DataCollector'
import { DataConditionMatcher as DataConditionMatcherClass } from './data/DataConditionMatcher'

export namespace NajsEloquent.Data {
  export const DataBuffer: typeof DataBufferClass = DataBufferClass
  export const DataCollector: typeof DataCollectorClass = DataCollectorClass
  export const DataConditionMatcher: typeof DataConditionMatcherClass = DataConditionMatcherClass

  export interface DataBuffer<T extends object> extends DataBufferClass<T> {}
  export interface DataCollector<T> extends DataCollectorClass<T> {}
  export interface DataConditionMatcher<T extends object> extends DataConditionMatcherClass<T> {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package: Driver
import { DriverBase as DriverBaseClass } from './drivers/DriverBase'
import { ExecutorBase as ExecutorBaseClass } from './drivers/ExecutorBase'
import { QueryLogBase as QueryLogBaseClass, IQueryLogData as QueryLogDataInterface } from './drivers/QueryLogBase'
import { Record as RecordClass } from './drivers/Record'
import { RecordConditionMatcher as RecordConditionMatcherClass } from './drivers/RecordConditionMatcher'
import { RecordConditionMatcherFactory as RecordConditionMatcherFactoryClass } from './drivers/RecordConditionMatcherFactory'
import { RecordDataReader as RecordDataReaderClass } from './drivers/RecordDataReader'
import { RecordDataSourceBase as RecordDataSourceBaseClass } from './drivers/RecordDataSourceBase'
import { RecordExecutorBase as RecordExecutorBaseClass } from './drivers/RecordExecutorBase'
import { RecordManager as RecordManagerClass } from './drivers/RecordManager'
import { RecordManagerBase as RecordManagerBaseClass } from './drivers/RecordManagerBase'

export namespace NajsEloquent.Driver {
  export const DriverBase: typeof DriverBaseClass = DriverBaseClass
  export interface DriverBase<T> extends DriverBaseClass<T> {}

  export const ExecutorBase: typeof ExecutorBaseClass = ExecutorBaseClass
  export interface ExecutorBase extends ExecutorBaseClass {}

  export const QueryLogBase: typeof QueryLogBaseClass = QueryLogBaseClass
  export interface QueryLogBase<T extends IQueryLogData> extends QueryLogBaseClass<T> {}
  export interface IQueryLogData extends QueryLogDataInterface {}

  export const Record: typeof RecordClass = RecordClass
  export interface Record extends RecordClass {}

  export const RecordConditionMatcher: typeof RecordConditionMatcherClass = RecordConditionMatcherClass
  export interface RecordConditionMatcher extends RecordConditionMatcherClass {}

  export const RecordConditionMatcherFactory: typeof RecordConditionMatcherFactoryClass = RecordConditionMatcherFactoryClass
  export interface RecordConditionMatcherFactory extends RecordConditionMatcherFactoryClass {}

  export const RecordDataReader: typeof RecordDataReaderClass = RecordDataReaderClass

  export const RecordDataSourceBase: typeof RecordDataSourceBaseClass = RecordDataSourceBaseClass
  export interface RecordDataSourceBase extends RecordDataSourceBaseClass {}

  export const RecordExecutorBase: typeof RecordExecutorBaseClass = RecordExecutorBaseClass
  export interface RecordExecutorBase extends RecordExecutorBaseClass {}

  export const RecordManager: typeof RecordManagerClass = RecordManagerClass
  export interface RecordManager<T extends RecordClass> extends RecordManagerClass<T> {}

  export const RecordManagerBase: typeof RecordManagerBaseClass = RecordManagerBaseClass
  export interface RecordManagerBase<T> extends RecordManagerBaseClass<T> {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package: Driver/Memory
import { MemoryDataSource as MemoryDataSourceClass } from './drivers/memory/MemoryDataSource'
import { MemoryDriver as MemoryDriverClass } from './drivers/memory/MemoryDriver'
import { MemoryExecutorFactory as MemoryExecutorFactoryClass } from './drivers/memory/MemoryExecutorFactory'
import { MemoryQueryBuilder as MemoryQueryBuilderClass } from './drivers/memory/MemoryQueryBuilder'
import { MemoryQueryBuilderHandler as MemoryQueryBuilderHandlerClass } from './drivers/memory/MemoryQueryBuilderHandler'
import { MemoryQueryBuilderFactory as MemoryQueryBuilderFactoryClass } from './drivers/memory/MemoryQueryBuilderFactory'
import { MemoryQueryExecutor as MemoryQueryExecutorClass } from './drivers/memory/MemoryQueryExecutor'
import { MemoryQueryLog as MemoryQueryLogClass } from './drivers/memory/MemoryQueryLog'
import { MemoryRecordExecutor as MemoryRecordExecutorClass } from './drivers/memory/MemoryRecordExecutor'

export namespace NajsEloquent.Driver.Memory {
  export const MemoryDataSource: typeof MemoryDataSourceClass = MemoryDataSourceClass
  export interface MemoryDataSource extends MemoryDataSourceClass {}

  export const MemoryDriver: typeof MemoryDriverClass = MemoryDriverClass
  export interface MemoryDriver extends MemoryDriverClass {}

  export const MemoryExecutorFactory: typeof MemoryExecutorFactoryClass = MemoryExecutorFactoryClass
  export interface MemoryExecutorFactory extends MemoryExecutorFactoryClass {}

  export const MemoryQueryBuilder: typeof MemoryQueryBuilderClass = MemoryQueryBuilderClass
  export interface MemoryQueryBuilder<T extends Model, H extends MemoryQueryBuilderHandlerClass>
    extends MemoryQueryBuilderClass<T, H> {}

  export const MemoryQueryBuilderHandler: typeof MemoryQueryBuilderHandlerClass = MemoryQueryBuilderHandlerClass
  export interface MemoryQueryBuilderHandler extends MemoryQueryBuilderHandlerClass {}

  export const MemoryQueryBuilderFactory: typeof MemoryQueryBuilderFactoryClass = MemoryQueryBuilderFactoryClass
  export interface MemoryQueryBuilderFactory extends MemoryQueryBuilderFactoryClass {}

  export const MemoryQueryExecutor: typeof MemoryQueryExecutorClass = MemoryQueryExecutorClass
  export interface MemoryQueryExecutor extends MemoryQueryExecutorClass {}

  export const MemoryQueryLog: typeof MemoryQueryLogClass = MemoryQueryLogClass
  export interface MemoryQueryLog extends MemoryQueryLogClass {}

  export const MemoryRecordExecutor: typeof MemoryRecordExecutorClass = MemoryRecordExecutorClass
  export interface MemoryRecordExecutor extends MemoryRecordExecutorClass {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package: Error
import { NotFoundError as NotFoundErrorClass } from './errors/NotFoundError'
import { RelationNotDefinedError as RelationNotDefinedErrorClass } from './errors/RelationNotDefinedError'
import { RelationNotFoundInNewInstanceError as RelationNotFoundInNewInstanceErrorClass } from './errors/RelationNotFoundInNewInstanceError'

export namespace NajsEloquent.Error {
  export const NotFoundError: typeof NotFoundErrorClass = NotFoundErrorClass
  export interface NotFoundError extends NotFoundErrorClass {}

  export const RelationNotDefinedError: typeof RelationNotDefinedErrorClass = RelationNotDefinedErrorClass
  export interface RelationNotDefinedError extends RelationNotDefinedErrorClass {}

  export const RelationNotFoundInNewInstanceError: typeof RelationNotFoundInNewInstanceErrorClass = RelationNotFoundInNewInstanceErrorClass
  export interface RelationNotFoundInNewInstanceError extends RelationNotFoundInNewInstanceErrorClass {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package: Factory
import { FactoryBuilder as FactoryBuilderClass } from './factory/FactoryBuilder'
import { FactoryManager as FactoryManagerClass } from './factory/FactoryManager'

export namespace NajsEloquent.Factory {
  export const FactoryBuilder: typeof FactoryBuilderClass = FactoryBuilderClass
  export interface FactoryBuilder<T extends Model> extends FactoryBuilderClass<T> {}

  export const FactoryManager: typeof FactoryManagerClass = FactoryManagerClass
  export interface FactoryManager extends FactoryManagerClass {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package: Feature
import { EventFeature as EventFeatureClass } from './features/EventFeature'
import { FeatureBase as FeatureBaseClass } from './features/FeatureBase'
import { FillableFeature as FillableFeatureClass } from './features/FillableFeature'
import { QueryFeature as QueryFeatureClass } from './features/QueryFeature'
import { RelationFeature as RelationFeatureClass } from './features/RelationFeature'
import { SerializationFeature as SerializationFeatureClass } from './features/SerializationFeature'
import { SettingFeature as SettingFeatureClass } from './features/SettingFeature'
import { SoftDeletesFeature as SoftDeletesFeatureClass } from './features/SoftDeletesFeature'
import { TimestampsFeature as TimestampsFeatureClass } from './features/TimestampsFeature'

export namespace NajsEloquent.Feature {
  export const EventFeature: typeof EventFeatureClass = EventFeatureClass
  export interface EventFeature extends EventFeatureClass {}

  export const FeatureBase: typeof FeatureBaseClass = FeatureBaseClass
  export interface FeatureBase extends FeatureBaseClass {}

  export const QueryFeature: typeof QueryFeatureClass = QueryFeatureClass
  export interface QueryFeature extends QueryFeatureClass {}

  export const FillableFeature: typeof FillableFeatureClass = FillableFeatureClass
  export interface FillableFeature extends FillableFeatureClass {}

  export const RelationFeature: typeof RelationFeatureClass = RelationFeatureClass
  export interface RelationFeature extends RelationFeatureClass {}

  export const SerializationFeature: typeof SerializationFeatureClass = SerializationFeatureClass
  export interface SerializationFeature extends SerializationFeatureClass {}

  export const SettingFeature: typeof SettingFeatureClass = SettingFeatureClass
  export interface SettingFeature extends SettingFeatureClass {}

  export const SoftDeletesFeature: typeof SoftDeletesFeatureClass = SoftDeletesFeatureClass
  export interface SoftDeletesFeature extends SoftDeletesFeatureClass {}

  export const TimestampsFeature: typeof TimestampsFeatureClass = TimestampsFeatureClass
  export interface TimestampsFeature extends TimestampsFeatureClass {}
}

// ---------------------------------------------------------------------------------------------------------------------
// // package: Feature/Mixin
import { EventPublicApi as EventPublicApiClass } from './features/mixin/EventPublicApi'
import { FillablePublicApi as FillablePublicApiClass } from './features/mixin/FillablePublicApi'
import { RecordManagerPublicApi as RecordManagerPublicApiClass } from './features/mixin/RecordManagerPublicApi'
import { RelationPublicApi as RelationPublicApiClass } from './features/mixin/RelationPublicApi'
import { SerializationPublicApi as SerializationPublicApiClass } from './features/mixin/SerializationPublicApi'
import { SoftDeletesPublicApi as SoftDeletesPublicApiClass } from './features/mixin/SoftDeletesPublicApi'
import { TimestampsPublicApi as TimestampsPublicApiClass } from './features/mixin/TimestampsPublicApi'

export namespace NajsEloquent.Feature.Mixin {
  export const EventPublicApi: typeof EventPublicApiClass = EventPublicApiClass

  export const FillablePublicApi: typeof FillablePublicApiClass = FillablePublicApiClass

  export const RecordManagerPublicApi: typeof RecordManagerPublicApiClass = RecordManagerPublicApiClass

  export const RelationPublicApi: typeof RelationPublicApiClass = RelationPublicApiClass

  export const SerializationPublicApi: typeof SerializationPublicApiClass = SerializationPublicApiClass

  export const SoftDeletesPublicApi: typeof SoftDeletesPublicApiClass = SoftDeletesPublicApiClass

  export const TimestampsPublicApi: typeof TimestampsPublicApiClass = TimestampsPublicApiClass
}

// ---------------------------------------------------------------------------------------------------------------------
// package Provider
import { DriverProvider as DriverProviderClass } from './providers/DriverProvider'
import { MemoryDataSourceProvider as MemoryDataSourceProviderClass } from './providers/MemoryDataSourceProvider'
import { MomentProvider as MomentProviderClass } from './providers/MomentProvider'

export namespace NajsEloquent.Provider {
  export const DriverProvider: typeof DriverProviderClass = DriverProviderClass
  export interface DriverProvider extends DriverProviderClass {}

  export const MemoryDataSourceProvider: typeof MemoryDataSourceProviderClass = MemoryDataSourceProviderClass
  export interface MemoryDataSourceProvider extends MemoryDataSourceProviderClass {}

  export const MomentProvider: typeof MomentProviderClass = MomentProviderClass
  export interface MomentProvider extends MomentProviderClass {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package QueryBuilder
import { QueryBuilder as QueryBuilderClass } from './query-builders/QueryBuilder'
import { QueryBuilderHandlerBase as QueryBuilderHandlerBaseClass } from './query-builders/QueryBuilderHandlerBase'

export namespace NajsEloquent.QueryBuilder {
  export const QueryBuilder: typeof QueryBuilderClass = QueryBuilderClass
  export interface QueryBuilder<T, H extends QueryBuilderHandlerBaseClass = QueryBuilderHandlerBaseClass>
    extends QueryBuilderClass<T, H> {}

  export const QueryBuilderHandlerBase: typeof QueryBuilderHandlerBaseClass = QueryBuilderHandlerBaseClass
  export interface QueryBuilderHandlerBase extends QueryBuilderHandlerBaseClass {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package QueryBuilder/Mixin
import { AdvancedQuery as AdvancedQueryClass } from './query-builders/mixin/AdvancedQuery'
import { ConditionQuery as ConditionQueryClass } from './query-builders/mixin/ConditionQuery'
import { ExecuteQuery as ExecuteQueryClass } from './query-builders/mixin/ExecuteQuery'
import { Query as QueryClass } from './query-builders/mixin/Query'

export namespace NajsEloquent.QueryBuilder.Mixin {
  export const AdvancedQuery: typeof AdvancedQueryClass = AdvancedQueryClass

  export const ConditionQuery: typeof ConditionQueryClass = ConditionQueryClass

  export const ExecuteQuery: typeof ExecuteQueryClass = ExecuteQueryClass

  export const Query: typeof QueryClass = QueryClass
}

// ---------------------------------------------------------------------------------------------------------------------
// package QueryBuilder/Shared
import { BasicQuery as BasicQueryClass } from './query-builders/shared/BasicQuery'
import { BasicQueryConverter as BasicQueryConverterClass } from './query-builders/shared/BasicQueryConverter'
import { ConditionQueryHandler as ConditionQueryHandlerClass } from './query-builders/shared/ConditionQueryHandler'
import { DefaultConvention as DefaultConventionClass } from './query-builders/shared/DefaultConvention'
import { ExecutorUtils as ExecutorUtilsClass } from './query-builders/shared/ExecutorUtils'
import { Operator as OperatorEnum } from './query-builders/shared/Operator'
import { QueryCondition as QueryConditionClass } from './query-builders/shared/QueryCondition'

export namespace NajsEloquent.QueryBuilder.Shared {
  export const BasicQuery: typeof BasicQueryClass = BasicQueryClass
  export interface BasicQuery extends BasicQueryClass {}

  export const BasicQueryConverter: typeof BasicQueryConverterClass = BasicQueryConverterClass
  export interface BasicQueryConverter extends BasicQueryConverterClass {}

  export const ConditionQueryHandler: typeof ConditionQueryHandlerClass = ConditionQueryHandlerClass
  export interface ConditionQueryHandler extends ConditionQueryHandlerClass {}

  export const DefaultConvention: typeof DefaultConventionClass = DefaultConventionClass
  export interface DefaultConvention extends DefaultConventionClass {}

  export const ExecutorUtils: typeof ExecutorUtilsClass = ExecutorUtilsClass
  export interface ExecutorUtils extends ExecutorUtilsClass {}

  export const Operator: typeof OperatorEnum = OperatorEnum

  export const QueryCondition: typeof QueryConditionClass = QueryConditionClass
  export interface QueryCondition extends QueryConditionClass {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package QueryLog
import { FlipFlopQueryLog as FlipFlopQueryLogClass } from './query-log/FlipFlopQueryLog'
export namespace NajsEloquent.QueryBuilder.Shared {
  export const FlipFlopQueryLog: typeof FlipFlopQueryLogClass = FlipFlopQueryLogClass
  export interface FlipFlopQueryLog extends FlipFlopQueryLogClass {}
}

// ---------------------------------------------------------------------------------------------------------------------
// package Util
import { ClassSetting as ClassSettingClass } from './util/ClassSetting'
import { PrototypeManager as PrototypeManagerClass } from './util/PrototypeManager'
import { SettingType as SettingTypeClass } from './util/SettingType'

export namespace NajsEloquent.Util {
  export const ClassSetting: typeof ClassSettingClass = ClassSettingClass
  export interface ClassSetting extends ClassSettingClass {}

  export const PrototypeManager: typeof PrototypeManagerClass = PrototypeManagerClass

  export const SettingType: typeof SettingTypeClass = SettingTypeClass
  export interface SettingType extends SettingTypeClass {}
}

// // package Relation
// // import { Relation } from './relations/Relation'
// // import { RelationData } from './relations/RelationData'
// // import { RelationDataBucket } from './relations/RelationDataBucket'
// // import { RelationDefinitionFinder } from './relations/RelationDefinitionFinder'
// // import { RelationFactory } from './relations/RelationFactory'
// // import { RelationUtilities } from './relations/RelationUtilities'
// // import { HasOneRelation } from './relations/basic/HasOneRelation'
