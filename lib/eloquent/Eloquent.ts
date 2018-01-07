import { IEloquent } from '../interfaces/IEloquent'
import { attributes_proxy } from '../components/attributes_proxy'
import collect, { Collection } from 'collect.js'
import { IAutoload, ClassRegistry, register, make } from 'najs'
import { pick } from 'lodash'

export abstract class Eloquent<NativeRecord extends Object = {}> implements IEloquent, IAutoload {
  protected __knownAttributeList: string[]
  protected attributes: NativeRecord
  protected fillable?: string[]
  protected guarded?: string[]
  protected softDeletes?: boolean
  protected timestamps?: boolean

  abstract getClassName(): string
  abstract newQuery(): any
  abstract toObject(): Object
  abstract toJson(): Object
  abstract is(model: any): boolean
  abstract fireEvent(event: string): this
  abstract save(): Promise<any>
  abstract delete(): Promise<any>
  abstract forceDelete(): Promise<any>
  abstract fresh(): Promise<this | undefined>
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
    if (!ClassRegistry.has(this.getClassName())) {
      register(Object.getPrototypeOf(this).constructor, this.getClassName(), false)
    }
    return this.initialize(data)
  }

  newInstance(): any
  newInstance(data: Object): any
  newInstance(data: NativeRecord): any
  newInstance(data?: NativeRecord | Object): any {
    const instance = make<Eloquent<NativeRecord>>(this.getClassName())
    return instance.initialize(data)
  }

  newCollection(dataset: Array<any>): Collection<IEloquent>
  newCollection(dataset: Array<Object>): Collection<IEloquent>
  newCollection(dataset: Array<NativeRecord>): Collection<IEloquent>
  newCollection(dataset: Array<NativeRecord | Object>): Collection<IEloquent> {
    return collect(dataset.map(item => this.newInstance(item)))
  }

  fill(data: Object): this {
    const fillableAttributes = pick(data, this.getFillable())
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
    return this.fillable || []
  }

  getGuarded(): string[] {
    return this.guarded || ['*']
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

  protected initialize(data: NativeRecord | Object | undefined) {
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
          Object.getOwnPropertyNames(Eloquent.prototype),
          Object.getOwnPropertyNames(Object.getPrototypeOf(this))
        )
      )
    )

    const proxy: Eloquent<NativeRecord> = new Proxy(this, attributes_proxy())
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
