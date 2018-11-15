/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../definitions/relations/IMorphToRelationship.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />

import Model = NajsEloquent.Model.IModel
import IMorphToRelationship = NajsEloquent.Relation.IMorphToRelationship
import RelationshipFetchType = NajsEloquent.Relation.RelationshipFetchType
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder
import QueryBuilderInternal = NajsEloquent.QueryBuilder.QueryBuilderInternal

import { make, register } from 'najs-binding'
import { Relationship } from '../Relationship'
import { RelationshipType } from '../RelationshipType'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { make_collection } from '../../util/factory'
import { array_unique } from '../../util/functions'
import { DataConditionMatcher } from '../../data/DataConditionMatcher'

export class MorphTo<T extends Model> extends Relationship<T> implements IMorphToRelationship<T> {
  static className: string = NajsEloquentClasses.Relation.Relationship.MorphTo
  protected rootMorphTypeName: string
  protected targetKeyNameMap: { [key in string]: string }
  private targetModelInstances: { [key in string]: Model }

  constructor(
    root: Model,
    relationName: string,
    rootType: string,
    rootKey: string,
    targetKeyNameMap: { [key in string]: string }
  ) {
    super(root, relationName)
    this.rootMorphTypeName = rootType
    this.rootKeyName = rootKey
    this.targetModelInstances = {}
    this.targetKeyNameMap = targetKeyNameMap
  }

  getClassName(): string {
    return NajsEloquentClasses.Relation.Relationship.MorphTo
  }

  getType(): string {
    return RelationshipType.MorphTo
  }

  makeTargetModel(modelName: string): Model {
    if (typeof this.targetModelInstances[modelName] === 'undefined') {
      this.targetModelInstances[modelName] = make<IModel>(modelName)
    }
    return this.targetModelInstances[modelName]
  }

  createQueryForTarget(targetModel: Model): IQueryBuilder<any> {
    const name = `${this.getType()}:${targetModel.getModelName()}`
    const queryBuilder = targetModel.newQuery(name) as QueryBuilderInternal
    queryBuilder.handler.setRelationDataBucket(this.getDataBucket())
    return this.applyCustomQuery(queryBuilder)
  }

  findTargetKeyName(targetModel: Model): string {
    const modelName = targetModel.getModelName()
    if (typeof this.targetKeyNameMap[modelName] !== 'undefined') {
      return this.targetKeyNameMap[modelName]
    }

    const morphType = Relationship.findMorphType(modelName)
    if (typeof this.targetKeyNameMap[morphType] !== 'undefined') {
      return this.targetKeyNameMap[morphType]
    }

    return targetModel.getPrimaryKeyName()
  }

  collectDataInBucket(dataBucket: IRelationDataBucket, targetModel: Model) {
    const rootKey = this.rootModel.getAttribute(this.rootKeyName)
    const dataBuffer = dataBucket.getDataOf(targetModel)
    const collector = dataBuffer.getCollector()
    collector.filterBy({
      $and: [new DataConditionMatcher(this.findTargetKeyName(targetModel), '=', rootKey, dataBuffer.getDataReader())]
    })
    return collector.exec()
  }

  collectData(): T | undefined | null {
    const dataBucket = this.getDataBucket()
    if (!dataBucket) {
      return undefined
    }

    const morphType = this.rootModel.getAttribute(this.rootMorphTypeName)
    const targetModel = this.makeTargetModel(Relationship.findModelName(morphType as string))

    const result = this.collectDataInBucket(dataBucket, targetModel)
    if (result.length === 0) {
      return undefined
    }
    return dataBucket.makeModel(targetModel, result[0]) as any
  }

  getEagerFetchInfo(dataBucket: IRelationDataBucket) {
    const dataBuffer = dataBucket.getDataOf(this.rootModel)
    const reader = dataBuffer.getDataReader()
    return dataBuffer.reduce((memo: object, item: any) => {
      const morphTypeValue: string = reader.getAttribute(item, this.rootMorphTypeName)
      const modelName = Relationship.findModelName(morphTypeValue)
      if (typeof memo[modelName] === 'undefined') {
        memo[modelName] = []
      }
      memo[modelName].push(reader.getAttribute(item, this.rootKeyName))
      return memo
    }, {})
  }

  async eagerFetchData(): Promise<T | undefined | null> {
    const dataBucket = this.getDataBucket()
    if (!dataBucket) {
      return make_collection([]) as any
    }

    const fetchInfo = this.getEagerFetchInfo(dataBucket)
    return (await Promise.all(
      Object.keys(fetchInfo).map((modelName: string) => {
        const targetModel = this.makeTargetModel(modelName)
        const query = this.createQueryForTarget(targetModel)

        query.whereIn(this.findTargetKeyName(targetModel), array_unique(fetchInfo[modelName]))

        return query.first()
      })
    )) as any
  }

  async fetchData(type: RelationshipFetchType): Promise<T | undefined | null> {
    if (type === 'eager') {
      return this.eagerFetchData()
    }

    const modelName = Relationship.findModelName(this.rootModel.getAttribute(this.rootMorphTypeName))
    const targetModel = this.makeTargetModel(modelName)
    const query = this.createQueryForTarget(targetModel)

    query.where(this.findTargetKeyName(targetModel), this.rootModel.getAttribute(this.rootKeyName))

    return query.first()
  }

  isInverseOf<K>(relationship: NajsEloquent.Relation.IRelationship<K>): boolean {
    return false
  }
}
register(MorphTo, NajsEloquentClasses.Relation.Relationship.MorphTo)
