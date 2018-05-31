/// <reference path="interfaces/IRelation.ts" />
/// <reference path="../collect.js/index.d.ts" />
/// <reference path="../model/interfaces/IEloquent.ts" />

import { make } from 'najs-binding'
import { flatten } from 'lodash'
import { Model } from '../model/Model'
import { RelationType } from './RelationType'
import { isModel, isCollection } from '../util/helpers'

export abstract class Relation implements NajsEloquent.Relation.IRelation {
  protected rootModel: NajsEloquent.Model.IModel<any>
  protected name: string
  protected loadChain: string[]
  protected type: RelationType

  constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string, type?: RelationType) {
    this.rootModel = rootModel
    this.name = name
    this.type = type || RelationType.Unknown
  }

  abstract getClassName(): string
  abstract buildData<T>(): T | undefined | null
  abstract lazyLoad<T>(): Promise<T | undefined | null>
  abstract eagerLoad<T>(): Promise<T | undefined | null>

  get relationData(): NajsEloquent.Relation.RelationData {
    return this.rootModel['relations'][this.name]
  }

  getType(): string {
    return this.type
  }

  with(...names: Array<string | string[]>) {
    this.loadChain = flatten(arguments).filter(item => item !== '')

    return this
  }

  getAttachedPropertyName(): string {
    return this.name
  }

  isLoaded(): boolean {
    return (
      !!this.relationData.isLoaded ||
      (typeof this.rootModel['relationDataBucket'] !== 'undefined' &&
        this.rootModel['relationDataBucket']!.isRelationLoaded(this.rootModel.getModelName(), this.name))
    )
  }

  isBuilt(): boolean {
    return !!this.relationData.isBuilt
  }

  markLoad(loaded: boolean) {
    this.relationData.isLoaded = loaded

    return this
  }

  markBuild(built: boolean) {
    this.relationData.isBuilt = built

    return this
  }

  getDataBucket(): NajsEloquent.Relation.IRelationDataBucket | undefined {
    return this.rootModel['relationDataBucket']
  }

  getModelByName(model: string): NajsEloquent.Model.IEloquent<any> {
    return make(model)
  }

  getKeysInDataBucket(table: string, key: string): string[] {
    const relationDataBucket = this.rootModel.getRelationDataBucket()
    if (!relationDataBucket) {
      return []
    }
    return relationDataBucket.getAttributes(table, key)
  }

  makeModelOrCollectionFromRecords(
    relationDataBucket: NajsEloquent.Relation.IRelationDataBucket,
    table: string,
    makeCollection: boolean,
    records: Object[]
  ): any {
    if (makeCollection) {
      return relationDataBucket.makeCollectionFromRecords(table, records)
    }

    if (records.length === 0) {
      return undefined
    }
    return relationDataBucket.makeModelFromRecord(table, records[0])
  }

  getData<T>(): T | undefined | null {
    if (!this.isLoaded()) {
      return undefined
    }

    if (this.isBuilt()) {
      return this.relationData.data
    }

    return this.buildData()
  }

  async load<T>(): Promise<T | undefined | null> {
    if (this.isLoaded() && this.isBuilt()) {
      return this.relationData.data
    }

    const dataBucket = this.rootModel.getRelationDataBucket()
    if (!dataBucket) {
      if (this.rootModel.isNew()) {
        throw new Error(`Can not load relation "${this.name}" in a new instance of "${this.rootModel.getModelName()}".`)
      }

      return this.loadChainRelations(await this.lazyLoad<T>())
    }

    dataBucket.markRelationLoaded(this.rootModel.getModelName(), this.name)
    return this.loadChainRelations(await this.eagerLoad<T>())
  }

  async loadChainRelations(result: any): Promise<any> {
    if (!result || !this.loadChain || this.loadChain.length === 0) {
      return result
    }

    if (isModel(result)) {
      await (result as Model).load(this.loadChain)
      return result
    }

    if (isCollection(result) && (result as CollectJs.Collection<any>).isNotEmpty()) {
      await (result as CollectJs.Collection<NajsEloquent.Model.IModel<any>>).first().load(this.loadChain)
    }

    return result
  }
}
