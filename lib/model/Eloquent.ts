import { IAutoload, make, ClassRegistry, register } from 'najs-binding'
import { EloquentMetadata, EloquentTimestamps, EloquentSoftDelete } from './EloquentMetadata'
import { EloquentDriverProvider } from '../facades/global/EloquentDriverProviderFacade'
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver'
import { EloquentProxy } from './EloquentProxy'
import { flatten, pick } from 'lodash'
import collect, { Collection } from 'collect.js'

/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
export abstract class Eloquent<Record extends Object = {}> implements IAutoload {
  protected attributes: Record
  protected driver: IEloquentDriver<Record>
  protected temporarySettings?: {
    fillable?: string[]
    guarded?: string[]
    visible?: string[]
    hidden?: string[]
  }

  // setting members
  protected fillable?: string[]
  protected guarded?: string[]
  protected visible?: string[]
  protected hidden?: string[]
  protected timestamps?: EloquentTimestamps | boolean
  protected softDeletes?: EloquentSoftDelete | boolean
  protected table?: string
  protected collection?: string
  protected schema?: Object
  protected options?: Object

  constructor()
  constructor(data: Object)
  constructor(data: Record)
  constructor(data?: any, isGuarded: boolean = true) {
    this.driver = EloquentDriverProvider.create(this, isGuarded)
    if (!ClassRegistry.has(this.getClassName())) {
      register(Object.getPrototypeOf(this).constructor, this.getClassName(), false)
    }
    if (data !== 'do-not-initialize') {
      this.driver.initialize(data)
      this.attributes = this.driver.getRecord()
      return new Proxy(this, EloquentProxy)
    }
  }

  static register(model: typeof Eloquent) {
    // just create new instance, it's auto register and bind static Queries
    register(model)
    Reflect.construct(model, [])
  }

  abstract getClassName(): string

  getModelName(): string {
    return this.getClassName()
  }

  getAttribute(name: string): any {
    return this.driver.getAttribute(name)
  }

  setAttribute(name: string, value: any): boolean {
    return this.driver.setAttribute(name, value)
  }

  toObject() {
    return this.driver.toObject()
  }

  toJSON() {
    return this.driver.toJSON()
  }

  toJson() {
    return this.driver.toJSON()
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
    return this.mergeWithTemporarySetting('fillable', EloquentMetadata.get(this).fillable())
  }

  getGuarded(): string[] {
    return this.mergeWithTemporarySetting('guarded', EloquentMetadata.get(this).guarded())
  }

  isFillable(key: string): boolean {
    return this.isInWhiteList(key, this.getFillable(), this.getGuarded())
  }

  isGuarded(key: string): boolean {
    return this.isInBlackList(key, this.getGuarded())
  }

  getVisible(): string[] {
    return this.mergeWithTemporarySetting('visible', EloquentMetadata.get(this).visible())
  }

  getHidden(): string[] {
    return this.mergeWithTemporarySetting('hidden', EloquentMetadata.get(this).hidden())
  }

  isVisible(key: string): boolean {
    return this.isInWhiteList(key, this.getVisible(), this.getHidden())
  }

  isHidden(key: string): boolean {
    return this.isInBlackList(key, this.getHidden())
  }

  protected isInWhiteList(key: string, whiteList: string[], blackList: string[]) {
    if (whiteList.length > 0 && whiteList.indexOf(key) !== -1) {
      return true
    }

    if (this.isInBlackList(key, blackList)) {
      return false
    }

    return whiteList.length === 0 && !EloquentMetadata.get(this).hasAttribute(key) && key.indexOf('_') !== 0
  }

  protected isInBlackList(key: string, blackList: string[]) {
    return (blackList.length === 1 && blackList[0] === '*') || blackList.indexOf(key) !== -1
  }

  private mergeWithTemporarySetting(name: string, value: any[]) {
    if (!this.temporarySettings || !this.temporarySettings[name]) {
      return value
    }
    return Array.from(new Set(value.concat(this.temporarySettings[name])))
  }

  private concatTemporarySetting(name: string, value: any[]): this {
    if (!this.temporarySettings) {
      this.temporarySettings = {}
    }
    if (!this.temporarySettings[name]) {
      this.temporarySettings[name] = []
    }
    this.temporarySettings[name] = Array.from(new Set(this.temporarySettings[name].concat(value)))
    return this
  }

  markFillable(key: string): this
  markFillable(keys: string[]): this
  markFillable(...keys: Array<string>): this
  markFillable(...keys: Array<string[]>): this
  markFillable(...args: Array<string | string[]>): this
  markFillable(): this {
    return this.concatTemporarySetting('fillable', flatten(arguments))
  }

  markGuarded(key: string): this
  markGuarded(keys: string[]): this
  markGuarded(...keys: Array<string>): this
  markGuarded(...keys: Array<string[]>): this
  markGuarded(...args: Array<string | string[]>): this
  markGuarded(): this {
    return this.concatTemporarySetting('guarded', flatten(arguments))
  }

  markVisible(key: string): this
  markVisible(keys: string[]): this
  markVisible(...keys: Array<string>): this
  markVisible(...keys: Array<string[]>): this
  markVisible(...args: Array<string | string[]>): this
  markVisible(): this {
    return this.concatTemporarySetting('visible', flatten(arguments))
  }

  markHidden(key: string): this
  markHidden(keys: string[]): this
  markHidden(...keys: Array<string>): this
  markHidden(...keys: Array<string[]>): this
  markHidden(...args: Array<string | string[]>): this
  markHidden(): this {
    return this.concatTemporarySetting('hidden', flatten(arguments))
  }

  newInstance(data?: Object | Record): this {
    return <any>make<Eloquent<Record>>(this.getClassName(), [data])
  }

  newCollection(dataset: Array<Object | Record>): Collection<this> {
    return collect(dataset.map(item => this.newInstance(item)))
  }

  protected getReservedNames(): Array<string> {
    return [
      'inspect',
      'valueOf',
      'attributes',
      'driver',
      'fillable',
      'guarded',
      'visible',
      'hidden',
      'temporarySettings',
      'softDeletes',
      'timestamps',
      'table',
      'collection',
      'schema',
      'options'
    ].concat(this.driver.getReservedNames())
  }
}
