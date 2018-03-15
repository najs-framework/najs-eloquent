import { EloquentMetadata, EloquentTimestamps, EloquentSoftDelete } from './EloquentMetadata'
import { IEloquent } from '../interfaces/IEloquent'
import { attributes_proxy } from '../components/attributes_proxy'
import collect, { Collection } from 'collect.js'
import { IAutoload, ClassRegistry, register, make } from 'najs-binding'
import { pick, isFunction, snakeCase } from 'lodash'

export type EloquentAccessor = {
  name: string
  type: 'getter' | 'function'
  ref?: string
}
export type EloquentMutator = {
  name: string
  type: 'setter' | 'function'
  ref?: string
}

export abstract class EloquentBase<NativeRecord extends Object = {}> implements IEloquent, IAutoload {
  protected static softDeletes: EloquentSoftDelete | boolean = false

  protected __knownAttributeList: string[]
  protected attributes: NativeRecord
  protected fillable?: string[]
  protected guarded?: string[]
  protected timestamps?: EloquentTimestamps | boolean
  protected softDeletes?: EloquentSoftDelete | boolean
  protected accessors: { [key in string]: EloquentAccessor }
  protected mutators: { [key in string]: EloquentMutator }

  abstract getId(): any
  abstract setId(value: any): void
  abstract getClassName(): string
  abstract newQuery(): any
  abstract toObject(): Object
  abstract toJson(): Object
  abstract is(model: any): boolean
  abstract fireEvent(event: string): this
  abstract save(): Promise<any>
  abstract delete(): Promise<any>
  abstract restore(): Promise<any>
  abstract forceDelete(): Promise<any>
  abstract fresh(): Promise<this | undefined | null>
  abstract touch(): void
  abstract getAttribute(name: string): any
  abstract setAttribute(name: string, value: any): boolean
  protected abstract isNativeRecord(data: NativeRecord | Object | undefined): boolean
  protected abstract initializeAttributes(): void
  protected abstract setAttributesByObject(nativeRecord: Object): void
  protected abstract setAttributesByNativeRecord(nativeRecord: NativeRecord): void

  constructor()
  constructor(data: Object)
  constructor(data: NativeRecord)
  constructor(data?: NativeRecord | Object) {
    // this is a hidden initialize, if the data === false we trigger initialize process
    // just simply returns a fresh instance. Only case use this option is create fresh
    // instance for getting metadata defined as class member (like: fillable, guard, timestamps...)
    if (data !== 'do-not-initialize') {
      this.registerIfNeeded()
      return this.initialize(data)
    }
  }

  public get id(): any {
    return this.getId()
  }

  public set id(value: any) {
    this.setId(value)
  }

  protected registerIfNeeded() {
    if (!ClassRegistry.has(this.getClassName())) {
      register(Object.getPrototypeOf(this).constructor, this.getClassName(), false)
    }
  }

  newInstance(): any
  newInstance(data: Object): any
  newInstance(data: NativeRecord): any
  newInstance(data?: NativeRecord | Object): any {
    const instance = make<EloquentBase<NativeRecord>>(this.getClassName())
    instance.fillable = this.fillable
    instance.guarded = this.guarded
    return instance.initialize(data)
  }

  newCollection(dataset: Array<any>): Collection<IEloquent>
  newCollection(dataset: Array<Object>): Collection<IEloquent>
  newCollection(dataset: Array<NativeRecord>): Collection<IEloquent>
  newCollection(dataset: Array<NativeRecord | Object>): Collection<IEloquent> {
    return collect(dataset.map(item => this.newInstance(item)))
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
    return EloquentMetadata.fillable(this)
  }

  getGuarded(): string[] {
    return EloquentMetadata.guarded(this)
  }

  isFillable(key: string): boolean {
    const fillable = this.getFillable()

    if (fillable.length > 0 && fillable.indexOf(key) !== -1) {
      return true
    }

    if (this.isGuarded(key)) {
      return false
    }

    return fillable.length === 0 && this.__knownAttributeList.indexOf(key) === -1 && key.indexOf('_') !== 0
  }

  isGuarded(key: string): boolean {
    const guarded: string[] = this.getGuarded()
    return (guarded.length === 1 && guarded[0] === '*') || guarded.indexOf(key) !== -1
  }

  // -------------------------------------------------------------------------------------------------------------------

  protected findGettersAndSetters() {
    // accessor by getter, only available for node >= 8.7
    const descriptors: Object = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))
    for (const name in descriptors) {
      if (isFunction(descriptors[name].get)) {
        this.accessors[name] = {
          name: name,
          type: 'getter'
        }
      }
      if (isFunction(descriptors[name].set)) {
        this.mutators[name] = {
          name: name,
          type: 'setter'
        }
      }
    }
  }

  protected findAccessorsAndMutators() {
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
    const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g')
    for (const name of names) {
      let match
      while ((match = regex.exec(name)) != undefined) {
        // javascript RegExp has a bug when the match has length 0
        // if (match.index === regex.lastIndex) {
        //   ++regex.lastIndex
        // }

        const property = snakeCase(match[2])

        if (match[1] === 'get') {
          if (typeof this.accessors[property] !== 'undefined') {
            continue
          }
          this.accessors[property] = {
            name: property,
            type: 'function',
            ref: match[0]
          }
        } else {
          if (typeof this.mutators[property] !== 'undefined') {
            continue
          }
          this.mutators[property] = {
            name: property,
            type: 'function',
            ref: match[0]
          }
        }
      }
    }
  }

  protected getAllValueOfAccessors(): Object {
    return Object.keys(this.accessors).reduce((memo, key) => {
      const accessor: EloquentAccessor = this.accessors[key]
      if (accessor.type === 'getter') {
        memo[key] = this[key]
      } else {
        memo[key] = this[<string>accessor.ref].call(this)
      }
      return memo
    }, {})
  }

  // -------------------------------------------------------------------------------------------------------------------

  protected initialize(data: NativeRecord | Object | undefined): any {
    this.accessors = {}
    this.mutators = {}
    this.findGettersAndSetters()
    this.findAccessorsAndMutators()

    if (this.isNativeRecord(data)) {
      this.setAttributesByNativeRecord(<NativeRecord>data)
    } else {
      if (typeof data === 'object') {
        this.setAttributesByObject(data)
      } else {
        this.initializeAttributes()
      }
    }

    this.__knownAttributeList = Array.from(
      new Set(
        this.getReservedPropertiesList().concat(
          Object.getOwnPropertyNames(this),
          Object.getOwnPropertyNames(EloquentBase.prototype),
          Object.getOwnPropertyNames(Object.getPrototypeOf(this))
        )
      )
    )

    const proxy: EloquentBase<NativeRecord> = new Proxy(this, attributes_proxy())
    return proxy
  }

  protected getReservedPropertiesList(): Array<string> {
    return [
      'inspect',
      'valueOf',
      '__knownAttributeList',
      'attributes',
      'fillable',
      'guarded',
      'softDeletes',
      'timestamps',
      'table'
    ]
  }
}
