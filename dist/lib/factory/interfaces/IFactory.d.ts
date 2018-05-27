/// <reference path="../../contracts/FactoryBuilder.d.ts" />
import { ModelClass } from './IFactoryManager';
export interface IFactory {
    <T>(className: string | ModelClass<T>): Najs.Contracts.Eloquent.FactoryBuilder<T>;
    <T>(className: string | ModelClass<T>, name: string): Najs.Contracts.Eloquent.FactoryBuilder<T>;
    <T>(className: string | ModelClass<T>, amount: number): Najs.Contracts.Eloquent.FactoryBuilder<T>;
    <T>(className: string | ModelClass<T>, name: string, amount: number): Najs.Contracts.Eloquent.FactoryBuilder<T>;
}
