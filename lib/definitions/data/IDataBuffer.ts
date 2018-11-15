/// <reference path="./IDataCollector.ts" />

namespace NajsEloquent.Data {
  export interface IDataBuffer<T> {
    /**
     * Get DataReader which is used by current DataBuffer.
     */
    getDataReader(): IDataReader<T>

    /**
     * Add data to buffer
     *
     * @param {object} data
     */
    add(data: T): this

    /**
     * Remove data out of buffer
     *
     * @param {object} data
     */
    remove(data: T): this

    /**
     * Find the first item which is matched callback.
     *
     * @param {Function} cb
     */
    find(cb: (item: T) => boolean): T | undefined

    /**
     * Filter items which are matched callback.
     *
     * @param {Function} cb
     */
    filter(cb: (item: T) => boolean): T[]

    /**
     * Transform items which are matched callback.
     *
     * @param {Function} cb
     */
    map<V>(cb: (item: T) => V): V[]

    /**
     * Reduce items.
     *
     * @param {Function} cb
     */
    reduce<V>(cb: ((memo: V, item: T) => V), initialValue: V): V

    /**
     * Get keys of buffered data.
     *
     * @param {Function} cb
     */
    keys<V>(): V[]

    /**
     * Iterator of the buffered data.
     */
    [Symbol.iterator](): IterableIterator<T>

    /**
     * Get Collector of this buffered data.
     */
    getCollector(): IDataCollector<T>
  }
}
