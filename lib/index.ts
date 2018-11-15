/// <reference path="contracts/Driver.ts" />
/// <reference path="contracts/DriverProvider.ts" />
/// <reference path="contracts/FactoryBuilder.ts" />
/// <reference path="contracts/FactoryManager.ts" />
/// <reference path="contracts/MemoryDataSource.ts" />
/// <reference path="contracts/MemoryDataSourceProvider.ts" />
/// <reference path="contracts/MomentProvider.ts" />
/// <reference path="contracts/QueryLog.ts" />

/// <reference path="definitions/collect.js/index.d.ts" />

/// <reference path="definitions/data/IDataBuffer.ts" />
/// <reference path="definitions/data/IDataCollector.ts" />
/// <reference path="definitions/data/IDataReader.ts" />

/// <reference path="definitions/driver/IExecutor.ts" />
/// <reference path="definitions/driver/IExecutorFactory.ts" />

/// <reference path="definitions/factory/IFactoryDefinition.ts" />

/// <reference path="definitions/features/IEventFeature.ts" />
/// <reference path="definitions/features/IFeature.ts" />
/// <reference path="definitions/features/IFillableFeature.ts" />
/// <reference path="definitions/features/IQueryFeature.ts" />
/// <reference path="definitions/features/IRecordExecutor.ts" />
/// <reference path="definitions/features/IRecordManager.ts" />
/// <reference path="definitions/features/IRelationFeature.ts" />
/// <reference path="definitions/features/ISerializationFeature.ts" />
/// <reference path="definitions/features/ISettingFeature.ts" />
/// <reference path="definitions/features/ISoftDeletesFeature.ts" />
/// <reference path="definitions/features/ITimestampsFeature.ts" />

/// <reference path="definitions/model/IModel.ts" />
/// <reference path="definitions/model/IModelEvent.ts" />
/// <reference path="definitions/model/IModelFillable.ts" />
/// <reference path="definitions/model/IModelRecord.ts" />
/// <reference path="definitions/model/IModelRelation.ts" />
/// <reference path="definitions/model/IModelSerialization.ts" />
/// <reference path="definitions/model/IModelSoftDeletes.ts" />
/// <reference path="definitions/model/IModelTimestamps.ts" />

/// <reference path="definitions/query-builders/IConditionMatcher.ts" />
/// <reference path="definitions/query-builders/IConvention.ts" />
/// <reference path="definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="definitions/query-builders/IQueryBuilderHandler.ts" />
/// <reference path="definitions/query-builders/IQueryBuilderFactory.ts" />
/// <reference path="definitions/query-builders/IQueryExecutor.ts" />

/// <reference path="definitions/query-grammars/IAdvancedQuery.ts" />
/// <reference path="definitions/query-grammars/IBasicConditionQuery.ts" />
/// <reference path="definitions/query-grammars/IBasicQuery.ts" />
/// <reference path="definitions/query-grammars/IConditionQuery.ts" />
/// <reference path="definitions/query-grammars/IExecuteQuery.ts" />
/// <reference path="definitions/query-grammars/IQuery.ts" />

/// <reference path="definitions/relations/IBelongsToRelationship.ts" />
/// <reference path="definitions/relations/IHasOneRelationship.ts" />
/// <reference path="definitions/relations/IHasManyRelationship.ts" />
/// <reference path="definitions/relations/IBelongsToManyRelationship.ts" />
/// <reference path="definitions/relations/IPivotOptions.ts" />
/// <reference path="definitions/relations/IRelationData.ts" />
/// <reference path="definitions/relations/IRelationData.ts" />
/// <reference path="definitions/relations/IRelationDataBucket.ts" />
/// <reference path="definitions/relations/IRelationship.ts" />
/// <reference path="definitions/relations/IRelationshipFactory.ts" />

import { MemoryDataSourceProvider } from './facades/global/MemoryDataSourceProviderFacade'
import { MemoryDataSource } from './drivers/memory/MemoryDataSource'
import { Model } from './model/Model'
import { Relationship } from './relations/Relationship'

import { DriverProvider } from './facades/global/DriverProviderFacade'
import { MemoryDriver } from './drivers/memory/MemoryDriver'

MemoryDataSourceProvider.register(MemoryDataSource, 'memory', true)
DriverProvider.register(MemoryDriver, 'memory')

export const Relation: NajsEloquent.Relation.IRelationshipStatic = Relationship

export { Model, Model as Eloquent }
export { PivotModel as Pivot } from './relations/relationships/pivot/PivotModel'
export { isModel, isCollection, isObjectId } from './util/helpers'
export { Builtin as NajsEloquent } from './builtin'

export type HasOne<T extends Model> = T | undefined | null
export type HasMany<T extends Model> = CollectJs.Collection<T> | undefined
export type BelongsTo<T extends Model> = T | undefined | null

// prettier-ignore
export type BelongsToMany<T extends Model, R extends Model = Model, K extends keyof any = 'pivot'> =
  CollectJs.Collection<T & { readonly [P in K]: R }> | undefined

export type MorphOne<T extends Model> = T | undefined | null
export type MorphMany<T extends Model> = CollectJs.Collection<T> | undefined
export type MorphTo<T extends Model> = T | undefined | null

export {
  DriverProvider,
  DriverProvider as ModelDriverProvider,
  DriverProvider as EloquentDriverProvider,
  DriverProviderFacade,
  DriverProviderFacade as ModelDriverProviderFacade,
  DriverProviderFacade as EloquentDriverProviderFacade
} from './facades/global/DriverProviderFacade'
export { factory, Factory, FactoryFacade } from './facades/global/FactoryFacade'
export { QueryLog, QueryLogFacade } from './facades/global/QueryLogFacade'
export {
  MemoryDataSourceProvider,
  MemoryDataSourceProviderFacade
} from './facades/global/MemoryDataSourceProviderFacade'
export { MomentProvider, MomentProviderFacade } from './facades/global/MomentProviderFacade'
