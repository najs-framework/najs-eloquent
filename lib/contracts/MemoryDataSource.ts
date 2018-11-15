/// <reference types="node" />
/// <reference types="najs-binding" />
/// <reference path="../definitions/data/IDataBuffer.ts" />

namespace Najs.Contracts.Eloquent {
  export interface MemoryDataSource<T extends object>
    extends Najs.Contracts.Autoload,
      NajsEloquent.Data.IDataBuffer<T> {
    /**
     * Read data from data source to buffer.
     */
    read(): Promise<boolean>

    /**
     * Write buffer to data source.
     */
    write(): Promise<boolean>
  }
}
