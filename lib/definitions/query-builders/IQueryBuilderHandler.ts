/// <reference path="./IQueryExecutor.ts" />
/// <reference path="../model/IModel.ts" />
/// <reference path="../collect.js/index.d.ts" />
/// <reference path="../query-grammars/IBasicQuery.ts" />
/// <reference path="../query-grammars/IConditionQuery.ts" />

namespace NajsEloquent.QueryBuilder {
  export interface IQueryBuilderHandler {
    getModel(): Model.IModel

    getBasicQuery(): QueryGrammar.IBasicQuery

    getConditionQuery(): QueryGrammar.IConditionQuery

    getQueryConvention(): IConvention

    getQueryExecutor(): IQueryExecutor

    getPrimaryKeyName(): string

    setQueryName(name: string): void

    getQueryName(): string

    getLogGroup(): string

    setLogGroup(group: string): void

    markUsed(): void

    isUsed(): boolean

    hasSoftDeletes(): boolean

    getSoftDeletesSetting(): Feature.ISoftDeletesSetting

    hasTimestamps(): boolean

    getTimestampsSetting(): Feature.ITimestampsSetting

    markSoftDeleteState(state: 'should-add' | 'should-not-add' | 'added'): void

    getSoftDeleteState(): string

    shouldAddSoftDeleteCondition(): boolean

    setRelationDataBucket(relationDataBucket: Relation.IRelationDataBucket | undefined): void

    getRelationDataBucket(): Relation.IRelationDataBucket

    createCollection(result: object[]): CollectJs.Collection<Model.IModel>

    createInstance(result: object): Model.IModel

    setEagerRelations(relations: string[]): void

    getEagerRelations(): string[] | undefined

    loadEagerRelations(model: Model.IModel): Promise<any>
  }
}
