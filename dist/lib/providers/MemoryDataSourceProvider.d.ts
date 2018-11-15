/// <reference path="../contracts/MemoryDataSource.d.ts" />
/// <reference path="../contracts/MemoryDataSourceProvider.d.ts" />
import MemoryDataSource = Najs.Contracts.Eloquent.MemoryDataSource;
import { Facade } from 'najs-facade';
import { Record } from '../drivers/Record';
export declare class MemoryDataSourceProvider extends Facade implements Najs.Contracts.Eloquent.MemoryDataSourceProvider<Record> {
    static className: string;
    protected dataSources: {
        [key: string]: {
            className: string;
            isDefault: boolean;
        };
    };
    protected dataSourceInstances: {
        [key: string]: any;
    };
    protected binding: {
        [key: string]: string;
    };
    getClassName(): string;
    protected findDefaultDataSourceClassName(): string;
    has(dataSource: any): boolean;
    create(model: NajsEloquent.Model.IModel): MemoryDataSource<Record>;
    findMemoryDataSourceClassName(model: NajsEloquent.Model.IModel | string): string;
    register(dataSource: string | Function, name: string, isDefault?: boolean): this;
    bind(model: string, driver: string): this;
}
