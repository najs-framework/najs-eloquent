import { IFactoryBuilder, IFactoryBuilderCollection } from './IFactoryBuilder';
import { ModelClass } from './IFactoryManager';
export interface IFactory {
    <T>(className: string | ModelClass<T>): IFactoryBuilder<T>;
    <T>(className: string | ModelClass<T>, name: string): IFactoryBuilder<T>;
    <T>(className: string | ModelClass<T>, amount: number): IFactoryBuilderCollection<T>;
    <T>(className: string | ModelClass<T>, name: string, amount: number): IFactoryBuilderCollection<T>;
}
