import { EloquentMetadata, EloquentTimestamps, EloquentSoftDelete } from './EloquentMetadata'
import { IAutoload, make } from 'najs-binding'
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver'
import { EloquentProxy } from './EloquentProxy'
import { pick } from 'lodash'
import { collect, Collection } from 'collect.js'

/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
export abstract class Eloquent<Record extends Object = {}> implements IAutoload {
  protected driver: IEloquentDriver<Record>

  // setting members
  protected fillable?: string[]
  protected guarded?: string[]
  protected timestamps?: EloquentTimestamps | boolean
  protected softDeletes?: EloquentSoftDelete | boolean
  protected table?: string

  constructor()
  constructor(data: Object)
  constructor(data: Record)
  constructor(data?: any) {
    if (data !== 'do-not-initialize') {
      this.driver = this.getDriver()
      this.driver.initialize(this, data)
      return new Proxy(this, EloquentProxy)
    }
  }

  abstract getClassName(): string

  getDriver(): IEloquentDriver<Record> {
    if (!this.driver) {
      this.driver = <any>{}
    }
    return this.driver
  }

  getAttribute(name: string): any {
    return this.driver.getAttribute(name)
  }

  setAttribute(name: string, value: any): boolean {
    return this.driver.setAttribute(name, value)
  }

  fill(data: Object): this {
    const fillable = this.getFillable()
    const fillableAttributes = fillable.length > 0 ? pick(data, fillable) : data
    for (const key in fillableAttributes) {
      if (this.isFillable(key)) {
        this.setAttribute(key, fillableAttributes[key])
      }
    }

    return this
  }

  forceFill(data: Object): this {
    for (const key in data) {
      this.setAttribute(key, data[key])
    }
    return this
  }

  getFillable(): string[] {
    return EloquentMetadata.get(this).fillable()
  }

  getGuarded(): string[] {
    return EloquentMetadata.get(this).guarded()
  }

  isFillable(key: string): boolean {
    const fillable = this.getFillable()

    if (fillable.length > 0 && fillable.indexOf(key) !== -1) {
      return true
    }

    if (this.isGuarded(key)) {
      return false
    }

    return fillable.length === 0 && EloquentMetadata.get(this).hasAttribute(key) && key.indexOf('_') !== 0
  }

  isGuarded(key: string): boolean {
    const guarded: string[] = this.getGuarded()
    return (guarded.length === 1 && guarded[0] === '*') || guarded.indexOf(key) !== -1
  }

  newInstance(data: any): any {
    return make<Eloquent<Record>>(this.getClassName(), [data])
  }

  newCollection(dataset: any[]): Collection<this> {
    return collect(dataset.map(item => this.newInstance(item)))
  }
}
