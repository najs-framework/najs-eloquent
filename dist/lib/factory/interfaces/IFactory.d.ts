import { IFactoryBuilder } from './IFactoryBuilder';
import { ModelClass } from './IFactoryManager';
export interface IFactory<T = any> {
    (className: string | ModelClass): IFactoryBuilder<T>;
    (className: string | ModelClass, name: string): IFactoryBuilder<T>;
}
