/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/relations/IRelationship.ts" />

import IModel = NajsEloquent.Model.IModel
import ModelDefinition = NajsEloquent.Model.ModelDefinition
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder
import QueryBuilderInternal = NajsEloquent.QueryBuilder.QueryBuilderInternal
import IRelationship = NajsEloquent.Relation.IRelationship
import IRelationshipQuery = NajsEloquent.Relation.IRelationshipQuery
import RelationshipFetchType = NajsEloquent.Relation.RelationshipFetchType
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket
import IRelationData = NajsEloquent.Relation.IRelationData

import { make, getClassName } from 'najs-binding'
import { flatten } from 'lodash'
import { relationFeatureOf } from '../util/accessors'
import { RelationUtilities as Utils } from './RelationUtilities'
import { array_unique } from '../util/functions'
import { RelationNotFoundInNewInstanceError } from '../errors/RelationNotFoundInNewInstanceError'
import { isModel, distinctModelByClassInCollection } from '../util/helpers'

export abstract class Relationship<T> implements IRelationship<T> {
  protected name: string
  protected chains: string[]

  // Root information
  protected rootModel: IModel
  protected rootKeyName: string

  // Target information
  private targetModelInstance: IModel
  protected targetDefinition: ModelDefinition
  protected get targetModel(): IModel {
    if (!this.targetModelInstance) {
      this.targetModelInstance = make<IModel>(this.targetDefinition)
    }
    return this.targetModelInstance
  }
  protected targetKeyName: string

  protected customQueryFn: IRelationshipQuery<T> | undefined

  constructor(rootModel: IModel, name: string) {
    this.rootModel = rootModel
    this.name = name
    this.chains = []
  }

  abstract getClassName(): string

  abstract getType(): string

  /**
   * Collect data from RelationDataBucket.
   */
  abstract collectData(): T | undefined | null

  /**
   * Fetch data from database or data source.
   */
  abstract fetchData(type: RelationshipFetchType): Promise<T | undefined | null>

  abstract isInverseOf<K>(relation: IRelationship<K>): boolean

  with(...relations: Array<string | string[]>): this {
    this.chains = array_unique(this.chains, flatten(arguments).filter(item => item !== ''))

    return this
  }

  query(cb: IRelationshipQuery<T>): this {
    this.customQueryFn = cb

    return this
  }

  createTargetQuery(name: string | undefined): IQueryBuilder<any> {
    const queryBuilder = this.targetModel.newQuery(name as any) as QueryBuilderInternal
    queryBuilder.handler.setRelationDataBucket(this.getDataBucket())
    return this.applyCustomQuery(queryBuilder)
  }

  applyCustomQuery(queryBuilder: IQueryBuilder<any>): IQueryBuilder<any> {
    if (typeof this.customQueryFn === 'function') {
      this.customQueryFn.call(queryBuilder, queryBuilder)
    }
    return queryBuilder
  }

  getName(): string {
    return this.name
  }

  getChains(): string[] {
    return this.chains
  }

  getRelationData(): IRelationData<T> {
    return relationFeatureOf(this.rootModel).findDataByName<T>(this.rootModel, this.name)
  }

  getDataBucket(): IRelationDataBucket | undefined {
    return relationFeatureOf(this.rootModel).getDataBucket(this.rootModel)
  }

  isLoaded(): boolean {
    return this.getRelationData().isLoaded() || Utils.isLoadedInDataBucket(this, this.rootModel, this.name)
  }

  getData(): T | undefined | null {
    if (!this.isLoaded()) {
      return undefined
    }

    const relationData = this.getRelationData()
    if (relationData.hasData()) {
      return relationData.getData()
    }

    return this.markInverseRelationshipsToLoaded(relationData.setData(this.collectData()))
  }

  markInverseRelationshipsToLoaded(result: any) {
    if (!result || !this.getDataBucket()) {
      return result
    }

    if (isModel(result)) {
      this.getInverseRelationships(result).forEach(relation => {
        Utils.markLoadedInDataBucket(this, result, relation.getName())
      })
      return result
    }

    distinctModelByClassInCollection(result).forEach(model => {
      this.getInverseRelationships(model).forEach(relation => {
        Utils.markLoadedInDataBucket(this, model, relation.getName())
      })
    })

    return result
  }

  getInverseRelationships(model: IModel): IRelationship<any>[] {
    const result: IRelationship<any>[] = []

    const definitions = relationFeatureOf(model).getDefinitions(model)
    for (const name in definitions) {
      const relation = model.getRelation(name)
      if (this.isInverseOf(relation)) {
        result.push(relation)
      }
    }

    return result
  }

  async lazyLoad(): Promise<T | undefined | null> {
    return this.loadData('lazy')
  }

  async eagerLoad(): Promise<T | undefined | null> {
    return this.loadData('eager')
  }

  async loadData(type: 'lazy' | 'eager') {
    const relationData = this.getRelationData().setLoadType(type)
    const result = await this.fetchData(type)

    if (type === 'lazy') {
      relationData.setData(result)
    } else {
      Utils.markLoadedInDataBucket(this, this.rootModel, this.name)
    }
    return this.loadChains(result)
  }

  async loadChains(result: any) {
    if (!result || !this.chains || this.chains.length === 0) {
      return result
    }

    if (isModel(result)) {
      await (result as Model).load(this.chains)
      return result
    }

    const models = distinctModelByClassInCollection(result)
    if (models.length > 0) {
      await Promise.all(models.map(model => model.load(this.chains)))
    }

    return result
  }

  async load(): Promise<T | undefined | null> {
    if (this.isLoaded()) {
      return this.getData()
    }

    const dataBucket = this.getDataBucket()
    if (!dataBucket) {
      if (this.rootModel.isNew()) {
        throw new RelationNotFoundInNewInstanceError(this.name, this.rootModel.getModelName())
      }

      return await this.lazyLoad()
    }

    return await this.eagerLoad()
  }

  // Static API -----------------------------------
  private static morphMapData: { [key in string]: string } = {}

  public static morphMap(arg1: string | object, arg2?: string | ModelDefinition): typeof Relationship {
    if (typeof arg1 === 'object') {
      this.morphMapData = Object.assign({}, this.morphMapData, arg1)
    }

    if (typeof arg1 === 'string' && typeof arg2 === 'string') {
      this.morphMapData[arg1] = arg2
    }

    if (typeof arg1 === 'string' && typeof arg2 === 'function') {
      this.morphMapData[arg1] = getClassName(arg2)
    }

    return this
  }

  public static getMorphMap(): { [type in string]: string } {
    return this.morphMapData
  }

  public static findModelName(type: string): string {
    return typeof this.morphMapData[type] === 'undefined' ? type : this.morphMapData[type]
  }

  public static findMorphType(model: string | Model | ModelDefinition): string {
    let modelName = isModel(model) ? (model as Model).getModelName() : ''
    if (typeof model === 'string') {
      modelName = model
    }

    if (typeof model === 'function') {
      modelName = getClassName(model)
    }

    for (const type in this.morphMapData) {
      if (this.morphMapData[type] === modelName) {
        return type
      }
    }
    return modelName
  }
}
