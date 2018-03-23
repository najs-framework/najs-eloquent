import { IFactoryBuilder } from './IFactoryBuilder';
export declare type FactoryDefinition<Faker> = (this: IFactoryManager<Faker>, faker: Faker) => Object;
export interface IFactoryManager<Faker> {
    define(className: string, definition: FactoryDefinition<Faker>): this;
    defineAs(className: string, name: string, definition: FactoryDefinition<Faker>): this;
    state(className: string, state: string, definition: FactoryDefinition<Faker>): this;
    of(className: string, name: string): IFactoryBuilder;
    create<T = any>(className: string, attributes: Object): Promise<T>;
    createAs<T = any>(className: string, name: string, attributes: Object): Promise<T>;
    make<T = any>(className: string, attributes: Object): T;
    makeAs<T = any>(className: string, name: string, attributes: Object): T;
    raw<T = any>(className: string, attribute: Object, name: string): T;
    rawOf<T = any>(className: string, name: string, attributes: Object): T;
}
