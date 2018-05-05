/// <reference path="./interfaces/IRelation.ts" />
/// <reference path="./interfaces/IRelationDataBucket.ts" />

import { Model } from '../model/Model'

export class RelationModelBase<T> extends Model<T> implements NajsEloquent.Relation.IRelation {
  protected isRelationLoaded: boolean = false
  protected relationName: string

  getRelationName(): string {
    return this.relationName
  }

  getRelation(): NajsEloquent.Relation.IRelationQuery {
    return <any>{}
  }

  isLoaded(): boolean {
    return this.isRelationLoaded
  }

  async lazyLoad<T>(model: Model<T>): Promise<any> {}

  async eagerLoad<T>(model: Model<T>): Promise<any> {}

  getDataBucket(): NajsEloquent.Relation.IRelationDataBucket {
    return <any>{}
    // return this.relationDataBucket
  }

  setDataBucket(bucket: NajsEloquent.Relation.IRelationDataBucket): this {
    // this.relationDataBucket = bucket
    return this
  }
}
