import { IFactoryBuilder } from './IFactoryBuilder';
import { ModelClass } from './IFactoryManager';
export interface IFactory {
    (className: string | ModelClass): IFactoryBuilder;
    (className: string | ModelClass, name: string): IFactoryBuilder;
}
