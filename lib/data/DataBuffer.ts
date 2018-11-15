/// <reference path="../definitions/data/IDataReader.ts" />
/// <reference path="../definitions/data/IDataBuffer.ts" />

import { DataCollector } from './DataCollector'

export class DataBuffer<T extends object> implements NajsEloquent.Data.IDataBuffer<T> {
  protected primaryKeyName: string
  protected reader: NajsEloquent.Data.IDataReader<T>
  protected buffer: Map<any, T>

  constructor(primaryKeyName: string, reader: NajsEloquent.Data.IDataReader<T>) {
    this.primaryKeyName = primaryKeyName
    this.buffer = new Map()
    this.reader = reader
  }

  getPrimaryKeyName(): string {
    return this.primaryKeyName
  }

  getDataReader(): NajsEloquent.Data.IDataReader<T> {
    return this.reader
  }

  getBuffer(): Map<any, T> {
    return this.buffer
  }

  add(data: T): this {
    this.buffer.set(this.reader.getAttribute(data, this.primaryKeyName), data)

    return this
  }

  remove(data: T): this {
    this.buffer.delete(this.reader.getAttribute(data, this.primaryKeyName))

    return this
  }

  find(cb: (item: T) => boolean): T | undefined {
    return Array.from(this.buffer.values()).find(cb)
  }

  filter(cb: (item: T) => boolean): T[] {
    return Array.from(this.buffer.values()).filter(cb)
  }

  map<V>(cb: (item: T) => V): V[] {
    return Array.from(this.buffer.values()).map(cb)
  }

  reduce<V>(cb: ((memo: V, item: T) => V), initialValue: V): V {
    return Array.from(this.buffer.values()).reduce(cb, initialValue)
  }

  keys<V>(): V[] {
    return Array.from(this.buffer.keys())
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.buffer.values()
  }

  getCollector(): NajsEloquent.Data.IDataCollector<T> {
    return new DataCollector(this, this.reader)
  }
}
