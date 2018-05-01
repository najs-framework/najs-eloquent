/// <reference path="./interfaces/IRelationDataBucket.ts" />
/// <reference path="../collect.js/index.d.ts" />

import { make, register } from 'najs-binding'
import { NajsEloquent } from '../constants'
const collect = require('collect.js')

export class RelationDataBucket implements NajsEloquent.Relation.IRelationDataBucket {
  static className = NajsEloquent.Relation.RelationDataBucket

  protected modelMap: Object
  protected bucket: Object

  constructor() {
    this.modelMap = {}
    this.bucket = {}
  }

  getClassName(): string {
    return NajsEloquent.Relation.RelationDataBucket
  }

  register(name: string, modelName: string): this {
    this.modelMap[name] = modelName
    return this
  }

  newInstance<T>(name: string, record: Object): T {
    if (!this.modelMap[name]) {
      throw new ReferenceError(`"${name}" is not found or not registered yet.`)
    }
    const model: NajsEloquent.Model.IModel<any> = make(this.modelMap[name], [record])
    if (typeof this.bucket[name] === 'undefined') {
      this.bucket[name] = {}
    }

    this.bucket[name][model.getPrimaryKey()] = record
    model['relationDataBucket'] = this
    return <any>model
  }

  newCollection<T>(name: string, records: Object[]): CollectJs.Collection<T> {
    return collect(records.map(item => this.newInstance(name, item)))
  }
}
register(RelationDataBucket)
