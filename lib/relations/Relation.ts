/// <reference path="interfaces/IRelation.ts" />
/// <reference path="../model/interfaces/IEloquent.ts" />

import { make } from 'najs-binding'

export abstract class Relation implements NajsEloquent.Relation.IRelation {
  protected rootModel: NajsEloquent.Model.IModel<any>
  protected name: string

  constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string) {
    this.rootModel = rootModel
    this.name = name
  }

  abstract getClassName(): string
  abstract buildData<T>(): T | undefined | null
  abstract lazyLoad<T>(): Promise<T | undefined | null>
  abstract eagerLoad<T>(): Promise<T | undefined | null>

  get relationData(): NajsEloquent.Relation.RelationData {
    return this.rootModel['relations'][this.name]
  }

  getAttachedPropertyName(): string {
    return this.name
  }

  isLoaded(): boolean {
    return !!this.relationData.isLoaded
  }

  isBuilt(): boolean {
    return !!this.relationData.isBuilt
  }

  getDataBucket(): NajsEloquent.Relation.IRelationDataBucket | undefined {
    return this.rootModel['relationDataBucket']
  }

  getModelByName(model: string): NajsEloquent.Model.IEloquent<any> {
    return make(model)
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

    if (!this.rootModel.getRelationDataBucket()) {
      if (this.rootModel.isNew()) {
        throw new Error(`Can not load relation "${this.name}" in a new instance of "${this.rootModel.getModelName()}".`)
      }

      return this.lazyLoad<T>()
    }

    return this.eagerLoad<T>()
  }
}
