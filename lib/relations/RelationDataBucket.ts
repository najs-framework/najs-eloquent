/// <reference path="./interfaces/IRelationDataBucket.ts" />
/// <reference path="../collect.js/index.d.ts" />

import { make, register } from 'najs-binding'
import { NajsEloquent } from '../constants'
import { eq } from 'lodash'
import { ObjectID } from 'bson'
const collect = require('collect.js')

export class RelationDataBucket implements NajsEloquent.Relation.IRelationDataBucket {
  static className = NajsEloquent.Relation.RelationDataBucket

  protected modelMap: Object
  protected bucket: Object
  protected loaded: Object

  constructor() {
    this.modelMap = {}
    this.bucket = {}
    this.loaded = {}
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
    const model: NajsEloquent.Model.IModel<any> = this.makeModelFromRecord(name, record)
    if (typeof this.bucket[name] === 'undefined') {
      this.bucket[name] = {}
    }

    this.bucket[name][model.getPrimaryKey()] = record
    return <any>model
  }

  newCollection<T>(name: string, records: Object[]): CollectJs.Collection<T> {
    return collect(records.map(item => this.newInstance(name, item)))
  }

  makeModelFromRecord(name: string, record: Object): NajsEloquent.Model.IModel<any> {
    const model: any = make(this.modelMap[name], [record])
    model['relationDataBucket'] = this
    return model
  }

  makeCollectionFromRecords(name: string, records: Object[]): CollectJs.Collection<NajsEloquent.Model.IModel<any>> {
    return collect(records.map(item => this.makeModelFromRecord(name, item)))
  }

  markRelationLoaded(modelName: string, relationName: string, loaded: boolean = true): this {
    if (typeof this.loaded[modelName] === 'undefined') {
      this.loaded[modelName] = {}
    }
    this.loaded[modelName][relationName] = loaded

    return this
  }

  isRelationLoaded(modelName: string, relationName: string): boolean {
    return typeof this.loaded[modelName] !== 'undefined' && this.loaded[modelName][relationName] === true
  }

  getAttributes(name: string, attribute: string, allowDuplicated: boolean = false): any[] {
    if (typeof this.bucket[name] === 'undefined') {
      return []
    }
    const result: any[] = []
    for (const key in this.bucket[name]) {
      const value = this.bucket[name][key][attribute]
      if (typeof value === 'undefined' || value === null) {
        continue
      }
      result.push(value)
    }
    return allowDuplicated ? result : Array.from(new Set(result))
  }

  filter(name: string, key: string, value: any, getFirstOnly: boolean = false): Object[] {
    if (typeof this.bucket[name] === 'undefined') {
      return []
    }
    const result: any[] = []

    const convertedValue = this.convertToStringIfValueIsObjectID(value)
    for (const id in this.bucket[name]) {
      const compareValue = this.convertToStringIfValueIsObjectID(this.bucket[name][id][key])
      if (eq(compareValue, convertedValue)) {
        result.push(this.bucket[name][id])

        if (getFirstOnly) {
          break
        }
      }
    }
    return result
  }

  convertToStringIfValueIsObjectID(value: any) {
    if (value instanceof ObjectID) {
      return value.toHexString()
    }
    return value
  }
}
register(RelationDataBucket)
