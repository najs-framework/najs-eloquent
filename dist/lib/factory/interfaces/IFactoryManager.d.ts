import { IFactoryBuilder } from './IFactoryBuilder';
import { Eloquent } from '../../model/Eloquent';
export declare type ModelClass = typeof Eloquent | Function;
export interface IFactoryDefinition<Faker> {
    (faker: Faker, attributes?: Object): Object;
}
export interface IFactoryManager<Faker> {
    define(className: string | ModelClass, definition: IFactoryDefinition<Faker>): this;
    defineAs(className: string | ModelClass, name: string, definition: IFactoryDefinition<Faker>): this;
    state(className: string | ModelClass, state: string, definition: IFactoryDefinition<Faker>): this;
    of<T>(className: string | ModelClass): IFactoryBuilder<T>;
    of<T>(className: string | ModelClass, name: string): IFactoryBuilder<T>;
    create<T = any>(className: string | ModelClass): Promise<T>;
    create<T = any>(className: string | ModelClass, attributes: Object): Promise<T>;
    createAs<T = any>(className: string | ModelClass, name: string): Promise<T>;
    createAs<T = any>(className: string | ModelClass, name: string, attributes: Object): Promise<T>;
    make<T = any>(className: string | ModelClass): T;
    make<T = any>(className: string | ModelClass, attributes: Object): T;
    makeAs<T = any>(className: string | ModelClass, name: string): T;
    makeAs<T = any>(className: string | ModelClass, name: string, attributes: Object): T;
    raw<T = any>(className: string | ModelClass): T;
    raw<T = any>(className: string | ModelClass, attributes: Object): T;
    rawOf<T = any>(className: string | ModelClass, name: string): T;
    rawOf<T = any>(className: string | ModelClass, name: string, attributes: Object): T;
}
