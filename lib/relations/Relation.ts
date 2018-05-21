/// <reference path="interfaces/IRelation.ts" />
/// <reference path="../model/interfaces/IEloquent.ts" />

import { make } from 'najs-binding'

export abstract class Relation {
  protected rootModel: NajsEloquent.Model.IModel<any>
  protected name: string

  constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string) {
    this.rootModel = rootModel
    this.name = name
  }

  abstract buildData<T>(): T | undefined
  abstract getClassName(): string
  abstract lazyLoad(): Promise<void>
  abstract eagerLoad(): Promise<void>

  protected getRelationInfo(): NajsEloquent.Relation.RelationData {
    return this.rootModel['relations'][this.name]
  }

  getAttachedPropertyName(): string {
    return this.name
  }

  isLoaded(): boolean {
    return !!this.getRelationInfo().isLoaded
  }

  getData<T>(): T | undefined {
    if (!this.isLoaded()) {
      return undefined
    }
    return this.buildData()
  }

  getDataBucket(): NajsEloquent.Relation.IRelationDataBucket | undefined {
    return this.rootModel['relationDataBucket']
  }

  getModelByName(model: string): NajsEloquent.Model.IEloquent<any> {
    return make(model)
  }
}
