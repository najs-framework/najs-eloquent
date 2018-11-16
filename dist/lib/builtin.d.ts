import { Model } from './model/Model';
import { DataBuffer as DataBufferClass } from './data/DataBuffer';
import { DataCollector as DataCollectorClass } from './data/DataCollector';
import { DataConditionMatcher as DataConditionMatcherClass } from './data/DataConditionMatcher';
export declare namespace NajsEloquent.Data {
    const DataBuffer: typeof DataBufferClass;
    const DataCollector: typeof DataCollectorClass;
    const DataConditionMatcher: typeof DataConditionMatcherClass;
    interface DataBuffer<T extends object> extends DataBufferClass<T> {
    }
    interface DataCollector<T> extends DataCollectorClass<T> {
    }
    interface DataConditionMatcher<T extends object> extends DataConditionMatcherClass<T> {
    }
}
import { DriverBase as DriverBaseClass } from './drivers/DriverBase';
import { ExecutorBase as ExecutorBaseClass } from './drivers/ExecutorBase';
import { QueryLogBase as QueryLogBaseClass, IQueryLogData as QueryLogDataInterface } from './drivers/QueryLogBase';
import { Record as RecordClass } from './drivers/Record';
import { RecordConditionMatcher as RecordConditionMatcherClass } from './drivers/RecordConditionMatcher';
import { RecordConditionMatcherFactory as RecordConditionMatcherFactoryClass } from './drivers/RecordConditionMatcherFactory';
import { RecordDataReader as RecordDataReaderClass } from './drivers/RecordDataReader';
import { RecordDataSourceBase as RecordDataSourceBaseClass } from './drivers/RecordDataSourceBase';
import { RecordExecutorBase as RecordExecutorBaseClass } from './drivers/RecordExecutorBase';
import { RecordManager as RecordManagerClass } from './drivers/RecordManager';
import { RecordManagerBase as RecordManagerBaseClass } from './drivers/RecordManagerBase';
export declare namespace NajsEloquent.Driver {
    const DriverBase: typeof DriverBaseClass;
    interface DriverBase<T> extends DriverBaseClass<T> {
    }
    const ExecutorBase: typeof ExecutorBaseClass;
    interface ExecutorBase extends ExecutorBaseClass {
    }
    const QueryLogBase: typeof QueryLogBaseClass;
    interface QueryLogBase<T extends IQueryLogData> extends QueryLogBaseClass<T> {
    }
    interface IQueryLogData extends QueryLogDataInterface {
    }
    const Record: typeof RecordClass;
    interface Record extends RecordClass {
    }
    const RecordConditionMatcher: typeof RecordConditionMatcherClass;
    interface RecordConditionMatcher extends RecordConditionMatcherClass {
    }
    const RecordConditionMatcherFactory: typeof RecordConditionMatcherFactoryClass;
    interface RecordConditionMatcherFactory extends RecordConditionMatcherFactoryClass {
    }
    const RecordDataReader: typeof RecordDataReaderClass;
    const RecordDataSourceBase: typeof RecordDataSourceBaseClass;
    interface RecordDataSourceBase extends RecordDataSourceBaseClass {
    }
    const RecordExecutorBase: typeof RecordExecutorBaseClass;
    interface RecordExecutorBase extends RecordExecutorBaseClass {
    }
    const RecordManager: typeof RecordManagerClass;
    interface RecordManager<T extends RecordClass> extends RecordManagerClass<T> {
    }
    const RecordManagerBase: typeof RecordManagerBaseClass;
    interface RecordManagerBase<T> extends RecordManagerBaseClass<T> {
    }
}
import { MemoryDataSource as MemoryDataSourceClass } from './drivers/memory/MemoryDataSource';
import { MemoryDriver as MemoryDriverClass } from './drivers/memory/MemoryDriver';
import { MemoryExecutorFactory as MemoryExecutorFactoryClass } from './drivers/memory/MemoryExecutorFactory';
import { MemoryQueryBuilder as MemoryQueryBuilderClass } from './drivers/memory/MemoryQueryBuilder';
import { MemoryQueryBuilderHandler as MemoryQueryBuilderHandlerClass } from './drivers/memory/MemoryQueryBuilderHandler';
import { MemoryQueryBuilderFactory as MemoryQueryBuilderFactoryClass } from './drivers/memory/MemoryQueryBuilderFactory';
import { MemoryQueryExecutor as MemoryQueryExecutorClass } from './drivers/memory/MemoryQueryExecutor';
import { MemoryQueryLog as MemoryQueryLogClass } from './drivers/memory/MemoryQueryLog';
import { MemoryRecordExecutor as MemoryRecordExecutorClass } from './drivers/memory/MemoryRecordExecutor';
export declare namespace NajsEloquent.Driver.Memory {
    const MemoryDataSource: typeof MemoryDataSourceClass;
    interface MemoryDataSource extends MemoryDataSourceClass {
    }
    const MemoryDriver: typeof MemoryDriverClass;
    interface MemoryDriver extends MemoryDriverClass {
    }
    const MemoryExecutorFactory: typeof MemoryExecutorFactoryClass;
    interface MemoryExecutorFactory extends MemoryExecutorFactoryClass {
    }
    const MemoryQueryBuilder: typeof MemoryQueryBuilderClass;
    interface MemoryQueryBuilder<T extends Model, H extends MemoryQueryBuilderHandlerClass> extends MemoryQueryBuilderClass<T, H> {
    }
    const MemoryQueryBuilderHandler: typeof MemoryQueryBuilderHandlerClass;
    interface MemoryQueryBuilderHandler extends MemoryQueryBuilderHandlerClass {
    }
    const MemoryQueryBuilderFactory: typeof MemoryQueryBuilderFactoryClass;
    interface MemoryQueryBuilderFactory extends MemoryQueryBuilderFactoryClass {
    }
    const MemoryQueryExecutor: typeof MemoryQueryExecutorClass;
    interface MemoryQueryExecutor extends MemoryQueryExecutorClass {
    }
    const MemoryQueryLog: typeof MemoryQueryLogClass;
    interface MemoryQueryLog extends MemoryQueryLogClass {
    }
    const MemoryRecordExecutor: typeof MemoryRecordExecutorClass;
    interface MemoryRecordExecutor extends MemoryRecordExecutorClass {
    }
}
import { NotFoundError as NotFoundErrorClass } from './errors/NotFoundError';
import { RelationNotDefinedError as RelationNotDefinedErrorClass } from './errors/RelationNotDefinedError';
import { RelationNotFoundInNewInstanceError as RelationNotFoundInNewInstanceErrorClass } from './errors/RelationNotFoundInNewInstanceError';
export declare namespace NajsEloquent.Error {
    const NotFoundError: typeof NotFoundErrorClass;
    interface NotFoundError extends NotFoundErrorClass {
    }
    const RelationNotDefinedError: typeof RelationNotDefinedErrorClass;
    interface RelationNotDefinedError extends RelationNotDefinedErrorClass {
    }
    const RelationNotFoundInNewInstanceError: typeof RelationNotFoundInNewInstanceErrorClass;
    interface RelationNotFoundInNewInstanceError extends RelationNotFoundInNewInstanceErrorClass {
    }
}
import { FactoryBuilder as FactoryBuilderClass } from './factory/FactoryBuilder';
import { FactoryManager as FactoryManagerClass } from './factory/FactoryManager';
export declare namespace NajsEloquent.Factory {
    const FactoryBuilder: typeof FactoryBuilderClass;
    interface FactoryBuilder<T extends Model> extends FactoryBuilderClass<T> {
    }
    const FactoryManager: typeof FactoryManagerClass;
    interface FactoryManager extends FactoryManagerClass {
    }
}
import { EventFeature as EventFeatureClass } from './features/EventFeature';
import { FeatureBase as FeatureBaseClass } from './features/FeatureBase';
import { FillableFeature as FillableFeatureClass } from './features/FillableFeature';
import { QueryFeature as QueryFeatureClass } from './features/QueryFeature';
import { RelationFeature as RelationFeatureClass } from './features/RelationFeature';
import { SerializationFeature as SerializationFeatureClass } from './features/SerializationFeature';
import { SettingFeature as SettingFeatureClass } from './features/SettingFeature';
import { SoftDeletesFeature as SoftDeletesFeatureClass } from './features/SoftDeletesFeature';
import { TimestampsFeature as TimestampsFeatureClass } from './features/TimestampsFeature';
export declare namespace NajsEloquent.Feature {
    const EventFeature: typeof EventFeatureClass;
    interface EventFeature extends EventFeatureClass {
    }
    const FeatureBase: typeof FeatureBaseClass;
    interface FeatureBase extends FeatureBaseClass {
    }
    const QueryFeature: typeof QueryFeatureClass;
    interface QueryFeature extends QueryFeatureClass {
    }
    const FillableFeature: typeof FillableFeatureClass;
    interface FillableFeature extends FillableFeatureClass {
    }
    const RelationFeature: typeof RelationFeatureClass;
    interface RelationFeature extends RelationFeatureClass {
    }
    const SerializationFeature: typeof SerializationFeatureClass;
    interface SerializationFeature extends SerializationFeatureClass {
    }
    const SettingFeature: typeof SettingFeatureClass;
    interface SettingFeature extends SettingFeatureClass {
    }
    const SoftDeletesFeature: typeof SoftDeletesFeatureClass;
    interface SoftDeletesFeature extends SoftDeletesFeatureClass {
    }
    const TimestampsFeature: typeof TimestampsFeatureClass;
    interface TimestampsFeature extends TimestampsFeatureClass {
    }
}
import { EventPublicApi as EventPublicApiClass } from './features/mixin/EventPublicApi';
import { FillablePublicApi as FillablePublicApiClass } from './features/mixin/FillablePublicApi';
import { RecordManagerPublicApi as RecordManagerPublicApiClass } from './features/mixin/RecordManagerPublicApi';
import { RelationPublicApi as RelationPublicApiClass } from './features/mixin/RelationPublicApi';
import { SerializationPublicApi as SerializationPublicApiClass } from './features/mixin/SerializationPublicApi';
import { SoftDeletesPublicApi as SoftDeletesPublicApiClass } from './features/mixin/SoftDeletesPublicApi';
import { TimestampsPublicApi as TimestampsPublicApiClass } from './features/mixin/TimestampsPublicApi';
export declare namespace NajsEloquent.Feature.Mixin {
    const EventPublicApi: typeof EventPublicApiClass;
    const FillablePublicApi: typeof FillablePublicApiClass;
    const RecordManagerPublicApi: typeof RecordManagerPublicApiClass;
    const RelationPublicApi: typeof RelationPublicApiClass;
    const SerializationPublicApi: typeof SerializationPublicApiClass;
    const SoftDeletesPublicApi: typeof SoftDeletesPublicApiClass;
    const TimestampsPublicApi: typeof TimestampsPublicApiClass;
}
import { DriverProvider as DriverProviderClass } from './providers/DriverProvider';
import { MemoryDataSourceProvider as MemoryDataSourceProviderClass } from './providers/MemoryDataSourceProvider';
import { MomentProvider as MomentProviderClass } from './providers/MomentProvider';
export declare namespace NajsEloquent.Provider {
    const DriverProvider: typeof DriverProviderClass;
    interface DriverProvider extends DriverProviderClass {
    }
    const MemoryDataSourceProvider: typeof MemoryDataSourceProviderClass;
    interface MemoryDataSourceProvider extends MemoryDataSourceProviderClass {
    }
    const MomentProvider: typeof MomentProviderClass;
    interface MomentProvider extends MomentProviderClass {
    }
}
import { QueryBuilder as QueryBuilderClass } from './query-builders/QueryBuilder';
import { QueryBuilderHandlerBase as QueryBuilderHandlerBaseClass } from './query-builders/QueryBuilderHandlerBase';
export declare namespace NajsEloquent.QueryBuilder {
    const QueryBuilder: typeof QueryBuilderClass;
    interface QueryBuilder<T, H extends QueryBuilderHandlerBaseClass = QueryBuilderHandlerBaseClass> extends QueryBuilderClass<T, H> {
    }
    const QueryBuilderHandlerBase: typeof QueryBuilderHandlerBaseClass;
    interface QueryBuilderHandlerBase extends QueryBuilderHandlerBaseClass {
    }
}
import { AdvancedQuery as AdvancedQueryClass } from './query-builders/mixin/AdvancedQuery';
import { ConditionQuery as ConditionQueryClass } from './query-builders/mixin/ConditionQuery';
import { ExecuteQuery as ExecuteQueryClass } from './query-builders/mixin/ExecuteQuery';
import { Query as QueryClass } from './query-builders/mixin/Query';
export declare namespace NajsEloquent.QueryBuilder.Mixin {
    const AdvancedQuery: typeof AdvancedQueryClass;
    const ConditionQuery: typeof ConditionQueryClass;
    const ExecuteQuery: typeof ExecuteQueryClass;
    const Query: typeof QueryClass;
}
import { BasicQuery as BasicQueryClass } from './query-builders/shared/BasicQuery';
import { BasicQueryConverter as BasicQueryConverterClass } from './query-builders/shared/BasicQueryConverter';
import { ConditionQueryHandler as ConditionQueryHandlerClass } from './query-builders/shared/ConditionQueryHandler';
import { DefaultConvention as DefaultConventionClass } from './query-builders/shared/DefaultConvention';
import { ExecutorUtils as ExecutorUtilsClass } from './query-builders/shared/ExecutorUtils';
import { Operator as OperatorEnum } from './query-builders/shared/Operator';
import { QueryCondition as QueryConditionClass } from './query-builders/shared/QueryCondition';
export declare namespace NajsEloquent.QueryBuilder.Shared {
    const BasicQuery: typeof BasicQueryClass;
    interface BasicQuery extends BasicQueryClass {
    }
    const BasicQueryConverter: typeof BasicQueryConverterClass;
    interface BasicQueryConverter extends BasicQueryConverterClass {
    }
    const ConditionQueryHandler: typeof ConditionQueryHandlerClass;
    interface ConditionQueryHandler extends ConditionQueryHandlerClass {
    }
    const DefaultConvention: typeof DefaultConventionClass;
    interface DefaultConvention extends DefaultConventionClass {
    }
    const ExecutorUtils: typeof ExecutorUtilsClass;
    interface ExecutorUtils extends ExecutorUtilsClass {
    }
    const Operator: typeof OperatorEnum;
    const QueryCondition: typeof QueryConditionClass;
    interface QueryCondition extends QueryConditionClass {
    }
}
import { FlipFlopQueryLog as FlipFlopQueryLogClass } from './query-log/FlipFlopQueryLog';
export declare namespace NajsEloquent.QueryBuilder.Shared {
    const FlipFlopQueryLog: typeof FlipFlopQueryLogClass;
    interface FlipFlopQueryLog extends FlipFlopQueryLogClass {
    }
}
import { ClassSetting as ClassSettingClass } from './util/ClassSetting';
import { PrototypeManager as PrototypeManagerClass } from './util/PrototypeManager';
import { SettingType as SettingTypeClass } from './util/SettingType';
export declare namespace NajsEloquent.Util {
    const ClassSetting: typeof ClassSettingClass;
    interface ClassSetting extends ClassSettingClass {
    }
    const PrototypeManager: typeof PrototypeManagerClass;
    const SettingType: typeof SettingTypeClass;
    interface SettingType extends SettingTypeClass {
    }
}
