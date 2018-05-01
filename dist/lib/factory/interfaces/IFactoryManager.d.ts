/// <reference path="../../model/interfaces/IModel.d.ts" />
import { IFactoryBuilder } from './IFactoryBuilder';
export interface ModelClass<T> {
    new (): T;
}
export interface IFactoryDefinition<Faker> {
    (faker: Faker, attributes?: Object): Object;
}
export interface IFactoryManager<Faker> {
    define(className: string | ModelClass<NajsEloquent.Model.IModel<any>>, definition: IFactoryDefinition<Faker>): this;
    defineAs(className: string | ModelClass<NajsEloquent.Model.IModel<any>>, name: string, definition: IFactoryDefinition<Faker>): this;
    state(className: string | ModelClass<NajsEloquent.Model.IModel<any>>, state: string, definition: IFactoryDefinition<Faker>): this;
    of<T>(className: string | ModelClass<T>): IFactoryBuilder<T>;
    of<T>(className: string | ModelClass<T>, name: string): IFactoryBuilder<T>;
    create<T = any>(className: string | ModelClass<T>): Promise<T>;
    create<T = any>(className: string | ModelClass<T>, attributes: Object): Promise<T>;
    createAs<T = any>(className: string | ModelClass<T>, name: string): Promise<T>;
    createAs<T = any>(className: string | ModelClass<T>, name: string, attributes: Object): Promise<T>;
    make<T = any>(className: string | ModelClass<T>): T;
    make<T = any>(className: string | ModelClass<T>, attributes: Object): T;
    makeAs<T = any>(className: string | ModelClass<T>, name: string): T;
    makeAs<T = any>(className: string | ModelClass<T>, name: string, attributes: Object): T;
    raw<T = any>(className: string | ModelClass<T>): Object;
    raw<T = any>(className: string | ModelClass<T>, attributes: Object): Object;
    rawOf<T = any>(className: string | ModelClass<T>, name: string): Object;
    rawOf<T = any>(className: string | ModelClass<T>, name: string, attributes: Object): Object;
}
