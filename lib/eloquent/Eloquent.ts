import { IEloquent } from '../interfaces/IEloquent'
import { attributes_proxy } from '../components/attributes_proxy'

export abstract class Eloquent<NativeRecord extends Object = {}> implements IEloquent<NativeRecord> {
  protected __knownAttributeList: Array<string>
  protected attributes: NativeRecord
  protected fillable: Array<string>
  protected guarded: Array<string>
  protected softDeletes: boolean
  protected timestamps: boolean

  abstract getClassName(): string

  constructor(data?: NativeRecord | Object) {
    this.initialize(data)

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
    return ['__knownAttributeList', 'attributes', 'fillable', 'guarded', 'softDeletes', 'timestamps', 'table']
  }

  protected initialize(data: NativeRecord | Object | undefined) {
    if (this.isNativeRecord(data)) {
      return this.setAttributesByNativeRecord(<NativeRecord>data)
    }

    if (typeof data === 'object') {
      return this.setAttributesByObject(data)
    }

    return this.initializeAttributes()
  }

  protected isNativeRecord(data: NativeRecord | Object | undefined): boolean {
    return typeof data === 'object'
  }

  protected initializeAttributes(): void {
    this.attributes = <NativeRecord>{}
  }

  protected setAttributesByObject(nativeRecord: Object): void {
    this.attributes = <NativeRecord>nativeRecord || <NativeRecord>{}
  }

  protected setAttributesByNativeRecord(nativeRecord: NativeRecord): void {
    this.attributes = <NativeRecord>nativeRecord
  }

  fill(attributes: Object): this {
    if (!this.fillable) {
      return this
    }
    for (const name in attributes) {
      if (this.fillable.indexOf(name) === -1) {
        continue
      }
      this.setAttribute(name, attributes[name])
    }
    return this
  }

  getAttribute(name: string): any {
    console.log('getAttribute', name)
    return this.attributes[name]
  }

  setAttribute(name: string, value: any): this {
    console.log('setAttribute', name, value)
    this.attributes[name] = value
    return this
  }

  toJson(): Object {
    return this.attributes
  }

  async save(): Promise<any> {}
  async create(): Promise<any> {}
  async update(): Promise<any> {}
  async delete(): Promise<any> {}
}
