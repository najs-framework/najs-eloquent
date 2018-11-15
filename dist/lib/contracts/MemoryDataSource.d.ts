/// <reference path="../definitions/data/IDataBuffer.d.ts" />
declare namespace Najs.Contracts.Eloquent {
    interface MemoryDataSource<T extends object> extends Najs.Contracts.Autoload, NajsEloquent.Data.IDataBuffer<T> {
        /**
         * Read data from data source to buffer.
         */
        read(): Promise<boolean>;
        /**
         * Write buffer to data source.
         */
        write(): Promise<boolean>;
    }
}
