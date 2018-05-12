/// <reference path="interfaces/IModel.ts" />

import { make } from 'najs-binding'
import { CREATE_SAMPLE } from '../util/ClassSetting'
import { ClassRegistry, register, getClassName } from 'najs-binding'
import { EloquentDriverProvider } from '../facades/global/EloquentDriverProviderFacade'
import { ModelSetting } from './components/ModelSetting'
import { ModelAttribute } from './components/ModelAttribute'
import { ModelFillable } from './components/ModelFillable'
import { ModelSerialization } from './components/ModelSerialization'
import { ModelActiveRecord } from './components/ModelActiveRecord'
import { ModelTimestamps } from './components/ModelTimestamps'
import { ModelSoftDeletes } from './components/ModelSoftDeletes'
const collect = require('collect.js')

export interface Model<T = any> extends NajsEloquent.Model.IModel<T> {}
export class Model<T = any> {
  /**
   * Model constructor.
   *
   * @param {Object|undefined} data
   * @param {boolean|undefined} isGuarded
   */
  constructor(data?: Object, isGuarded: boolean = true) {
    const className = getClassName(this)
    if (!ClassRegistry.has(className)) {
      register(Object.getPrototypeOf(this).constructor, className)
    }

    if (data !== CREATE_SAMPLE) {
      this.driver = EloquentDriverProvider.create(this)
      this.driver.initialize(this, isGuarded, data)
      this.attributes = this.driver.getRecord()
    }
  }

  getModelName() {
    return getClassName(this)
  }

  getRecordName() {
    return this.driver.getRecordName()
  }

  is(model: this | NajsEloquent.Model.IModel<T>): boolean {
    return this === model || this.getPrimaryKey().toString() === model.getPrimaryKey().toString()
  }

  newCollection(dataset: any[]): any {
    return collect(dataset.map(item => this.newInstance(item)))
  }

  newInstance(data?: Object | T): this {
    return <any>make(getClassName(this), [data])
  }
}

const defaultComponents: Najs.Contracts.Eloquent.Component[] = [
  make(ModelSetting.className),
  make(ModelAttribute.className),
  make(ModelFillable.className),
  make(ModelSerialization.className),
  make(ModelActiveRecord.className),
  make(ModelTimestamps.className),
  make(ModelSoftDeletes.className)
]
for (const component of defaultComponents) {
  component.extend(Model.prototype, [], <any>{})
}
