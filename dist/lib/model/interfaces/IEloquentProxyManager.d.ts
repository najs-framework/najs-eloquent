import { Eloquent } from '../Eloquent';
import { IEloquentProxy } from './IEloquentProxy';
export interface IEloquentProxyManager {
    proxify(target: Eloquent): any;
    getProxies(): IEloquentProxy[];
    getProxies(model: string): IEloquentProxy[];
    register(proxy: IEloquentProxy, name: string, isDefault: boolean): this;
    bind(model: string, proxyName: string): this;
}
