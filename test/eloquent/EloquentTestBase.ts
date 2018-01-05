import { Eloquent } from '../../lib/eloquent/Eloquent'
import { Record } from './Record'

export abstract class EloquentTestBase<T> extends Eloquent<Record<T>> {
  protected getReservedPropertiesList() {
    return super.getReservedPropertiesList().concat(Object.getOwnPropertyNames(EloquentTestBase.prototype))
  }

  abstract getClassName(): string

  newQuery(): any {}

  toObject(): Object {
    return this.attributes.data
  }

  toJson(): Object {
    return this.attributes.data
  }

  is(model: EloquentTestBase<T>): boolean {
    return false
  }

  fireEvent(event: string): this {
    return this
  }

  async save(): Promise<any> {
    await []
  }
  async delete(): Promise<any> {}
  async forceDelete(): Promise<any> {}
  async fresh(): Promise<this | undefined> {
    return this
  }

  getAttribute(name: string): any {
    return this.attributes.data[name]
  }

  setAttribute(name: string, value: any): boolean {
    this.attributes.data[name] = value
    return true
  }

  protected isNativeRecord(data: Object | undefined): boolean {
    return data instanceof Record
  }

  protected initializeAttributes(): void {
    this.attributes = Record.create({})
  }

  protected setAttributesByObject(nativeRecord: Object): void {
    this.attributes = Record.create(nativeRecord)
  }

  protected setAttributesByNativeRecord(nativeRecord: Record<T>): void {
    this.attributes = nativeRecord
  }
}
