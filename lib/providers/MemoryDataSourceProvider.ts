/// <reference path="../contracts/MemoryDataSource.ts" />
/// <reference path="../contracts/MemoryDataSourceProvider.ts" />

import MemoryDataSource = Najs.Contracts.Eloquent.MemoryDataSource
import { Facade } from 'najs-facade'
import { register, make, getClassName } from 'najs-binding'
import { NajsEloquent } from '../constants'
import { Record } from '../drivers/Record'

export class MemoryDataSourceProvider extends Facade
  implements Najs.Contracts.Eloquent.MemoryDataSourceProvider<Record> {
  static className: string = NajsEloquent.Provider.MemoryDataSourceProvider

  protected dataSources: {
    [key: string]: {
      className: string
      isDefault: boolean
    }
  } = {}

  protected dataSourceInstances: {
    [key: string]: any
  } = {}

  protected binding: {
    [key: string]: string
  } = {}

  getClassName() {
    return NajsEloquent.Provider.MemoryDataSourceProvider
  }

  protected findDefaultDataSourceClassName(): string {
    let first: string = ''
    for (const name in this.dataSources) {
      if (!first) {
        first = this.dataSources[name].className
      }
      if (this.dataSources[name].isDefault) {
        return this.dataSources[name].className
      }
    }
    return first
  }

  has(dataSource: any): boolean {
    for (const name in this.dataSources) {
      const item = this.dataSources[name]
      if (item.className === getClassName(dataSource)) {
        return true
      }
    }
    return false
  }

  create(model: NajsEloquent.Model.IModel): MemoryDataSource<Record> {
    const dataSourceClassName = this.findMemoryDataSourceClassName(model)
    const modelName = model.getModelName()
    if (typeof this.dataSourceInstances[modelName] === 'undefined') {
      this.dataSourceInstances[modelName] = make<MemoryDataSource<Record>>(dataSourceClassName, [model])
    }
    return this.dataSourceInstances[modelName]
  }

  findMemoryDataSourceClassName(model: NajsEloquent.Model.IModel | string): string {
    const modelName = typeof model === 'string' ? model : model.getModelName()
    if (this.binding[modelName] === 'undefined' || typeof this.dataSources[this.binding[modelName]] === 'undefined') {
      return this.findDefaultDataSourceClassName()
    }
    return this.dataSources[this.binding[modelName]].className
  }

  register(dataSource: string | Function, name: string, isDefault: boolean = false): this {
    if (typeof dataSource === 'function') {
      register(dataSource)
    }
    this.dataSources[name] = {
      className: getClassName(dataSource),
      isDefault: isDefault
    }
    return this
  }

  bind(model: string, driver: string): this {
    this.binding[model] = driver
    return this
  }
}
register(MemoryDataSourceProvider, NajsEloquent.Provider.MemoryDataSourceProvider)
