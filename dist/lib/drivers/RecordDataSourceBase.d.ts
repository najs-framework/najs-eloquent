/// <reference path="../contracts/MemoryDataSource.d.ts" />
/// <reference path="../definitions/model/IModel.d.ts" />
import { Record } from './Record';
import { DataBuffer } from '../data/DataBuffer';
export declare abstract class RecordDataSourceBase extends DataBuffer<Record> implements Najs.Contracts.Eloquent.MemoryDataSource<Record> {
    protected modelName: string;
    constructor(model: NajsEloquent.Model.IModel);
    getModelName(): string;
    abstract getClassName(): string;
    abstract createPrimaryKeyIfNeeded(data: Record): string;
    abstract read(): Promise<boolean>;
    abstract write(): Promise<boolean>;
    add(data: Record): this;
    remove(data: Record): this;
}
