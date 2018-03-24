import { IFactoryBuilder } from './IFactoryBuilder';
export declare type FactoryDefinition<Faker> = (faker: Faker, attributes?: Object) => Object;
export interface IFactoryManager<Faker> {
    define(className: string, definition: FactoryDefinition<Faker>): this;
    defineAs(className: string, name: string, definition: FactoryDefinition<Faker>): this;
    state(className: string, state: string, definition: FactoryDefinition<Faker>): this;
    of(className: string): IFactoryBuilder;
    of(className: string, name: string): IFactoryBuilder;
    create<T = any>(className: string): Promise<T>;
    create<T = any>(className: string, attributes: Object): Promise<T>;
    createAs<T = any>(className: string, name: string): Promise<T>;
    createAs<T = any>(className: string, name: string, attributes: Object): Promise<T>;
    make<T = any>(className: string): T;
    make<T = any>(className: string, attributes: Object): T;
    makeAs<T = any>(className: string, name: string): T;
    makeAs<T = any>(className: string, name: string, attributes: Object): T;
    raw<T = any>(className: string): T;
    raw<T = any>(className: string, attributes: Object): T;
    rawOf<T = any>(className: string, name: string): T;
    rawOf<T = any>(className: string, name: string, attributes: Object): T;
}
