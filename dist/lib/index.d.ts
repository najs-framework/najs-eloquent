/// <reference path="contracts/Driver.d.ts" />
/// <reference path="contracts/DriverProvider.d.ts" />
/// <reference path="contracts/FactoryBuilder.d.ts" />
/// <reference path="contracts/FactoryManager.d.ts" />
/// <reference path="contracts/MemoryDataSource.d.ts" />
/// <reference path="contracts/MemoryDataSourceProvider.d.ts" />
/// <reference path="contracts/MomentProvider.d.ts" />
/// <reference path="contracts/QueryLog.d.ts" />
/// <reference path="../../lib/definitions/collect.js/index.d.ts" />
/// <reference path="definitions/data/IDataBuffer.d.ts" />
/// <reference path="definitions/data/IDataCollector.d.ts" />
/// <reference path="definitions/data/IDataReader.d.ts" />
/// <reference path="definitions/driver/IExecutor.d.ts" />
/// <reference path="definitions/driver/IExecutorFactory.d.ts" />
/// <reference path="definitions/factory/IFactoryDefinition.d.ts" />
/// <reference path="definitions/features/IEventFeature.d.ts" />
/// <reference path="definitions/features/IFeature.d.ts" />
/// <reference path="definitions/features/IFillableFeature.d.ts" />
/// <reference path="definitions/features/IQueryFeature.d.ts" />
/// <reference path="definitions/features/IRecordExecutor.d.ts" />
/// <reference path="definitions/features/IRecordManager.d.ts" />
/// <reference path="definitions/features/IRelationFeature.d.ts" />
/// <reference path="definitions/features/ISerializationFeature.d.ts" />
/// <reference path="definitions/features/ISettingFeature.d.ts" />
/// <reference path="definitions/features/ISoftDeletesFeature.d.ts" />
/// <reference path="definitions/features/ITimestampsFeature.d.ts" />
/// <reference path="definitions/model/IModel.d.ts" />
/// <reference path="definitions/model/IModelEvent.d.ts" />
/// <reference path="definitions/model/IModelFillable.d.ts" />
/// <reference path="definitions/model/IModelRecord.d.ts" />
/// <reference path="definitions/model/IModelRelation.d.ts" />
/// <reference path="definitions/model/IModelSerialization.d.ts" />
/// <reference path="definitions/model/IModelSoftDeletes.d.ts" />
/// <reference path="definitions/model/IModelTimestamps.d.ts" />
/// <reference path="definitions/query-builders/IConditionMatcher.d.ts" />
/// <reference path="definitions/query-builders/IConvention.d.ts" />
/// <reference path="definitions/query-builders/IQueryBuilder.d.ts" />
/// <reference path="definitions/query-builders/IQueryBuilderHandler.d.ts" />
/// <reference path="definitions/query-builders/IQueryBuilderFactory.d.ts" />
/// <reference path="definitions/query-builders/IQueryExecutor.d.ts" />
/// <reference path="definitions/query-grammars/IAdvancedQuery.d.ts" />
/// <reference path="definitions/query-grammars/IBasicConditionQuery.d.ts" />
/// <reference path="definitions/query-grammars/IBasicQuery.d.ts" />
/// <reference path="definitions/query-grammars/IConditionQuery.d.ts" />
/// <reference path="definitions/query-grammars/IExecuteQuery.d.ts" />
/// <reference path="definitions/query-grammars/IQuery.d.ts" />
/// <reference path="definitions/relations/IBelongsToRelationship.d.ts" />
/// <reference path="definitions/relations/IHasOneRelationship.d.ts" />
/// <reference path="definitions/relations/IHasManyRelationship.d.ts" />
/// <reference path="definitions/relations/IBelongsToManyRelationship.d.ts" />
/// <reference path="definitions/relations/IPivotOptions.d.ts" />
/// <reference path="definitions/relations/IRelationData.d.ts" />
/// <reference path="definitions/relations/IRelationDataBucket.d.ts" />
/// <reference path="definitions/relations/IRelationship.d.ts" />
/// <reference path="definitions/relations/IRelationshipFactory.d.ts" />
import { Model } from './model/Model';
export declare const Relation: NajsEloquent.Relation.IRelationshipStatic;
export { Model, Model as Eloquent };
export { PivotModel as Pivot } from './relations/relationships/pivot/PivotModel';
export { isModel, isCollection, isObjectId } from './util/helpers';
export { Builtin as NajsEloquent } from './builtin';
export declare type HasOne<T extends Model> = T | undefined | null;
export declare type HasMany<T extends Model> = CollectJs.Collection<T> | undefined;
export declare type BelongsTo<T extends Model> = T | undefined | null;
export declare type BelongsToMany<T extends Model, R extends Model = Model, K extends keyof any = 'pivot'> = CollectJs.Collection<T & {
    readonly [P in K]: R;
}> | undefined;
export declare type MorphOne<T extends Model> = T | undefined | null;
export declare type MorphMany<T extends Model> = CollectJs.Collection<T> | undefined;
export declare type MorphTo<T extends Model> = T | undefined | null;
export { DriverProvider, DriverProvider as ModelDriverProvider, DriverProvider as EloquentDriverProvider, DriverProviderFacade, DriverProviderFacade as ModelDriverProviderFacade, DriverProviderFacade as EloquentDriverProviderFacade } from './facades/global/DriverProviderFacade';
export { factory, Factory, FactoryFacade } from './facades/global/FactoryFacade';
export { QueryLog, QueryLogFacade } from './facades/global/QueryLogFacade';
export { MemoryDataSourceProvider, MemoryDataSourceProviderFacade } from './facades/global/MemoryDataSourceProviderFacade';
export { MomentProvider, MomentProviderFacade } from './facades/global/MomentProviderFacade';
