/// <reference path="../contracts/FactoryManager.d.ts" />
/// <reference path="../contracts/FactoryBuilder.d.ts" />
/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference types="chance" />
import './FactoryBuilder';
import { Facade } from 'najs-facade';
export declare type ChanceFaker = Chance.Chance;
export declare class FactoryManager extends Facade implements Najs.Contracts.Eloquent.FactoryManager {
    static className: string;
    protected faker: ChanceFaker;
    protected definitions: Object;
    protected states: Object;
    constructor();
    getClassName(): string;
    protected addDefinition(bag: string, className: any, name: string, definition: any): this;
    private parseModelName(className);
    define(className: string | {
        new (): any;
    }, definition: NajsEloquent.Factory.FactoryDefinition, name?: string): this;
    defineAs(className: string | {
        new (): any;
    }, name: string, definition: NajsEloquent.Factory.FactoryDefinition): this;
    state(className: string | {
        new (): any;
    }, state: string, definition: NajsEloquent.Factory.FactoryDefinition): this;
    of<T>(className: string | {
        new (): T;
    }): Najs.Contracts.Eloquent.FactoryBuilder<T>;
    of<T>(className: string | {
        new (): T;
    }, name: string): Najs.Contracts.Eloquent.FactoryBuilder<T>;
    create<T>(className: string | {
        new (): T;
    }): T;
    create<T>(className: string | {
        new (): T;
    }, attributes: Object): T;
    createAs<T>(className: string | {
        new (): T;
    }, name: string): T;
    createAs<T>(className: string | {
        new (): T;
    }, name: string, attributes: Object): T;
    make<T>(className: string | {
        new (): T;
    }): T;
    make<T>(className: string | {
        new (): T;
    }, attributes: Object): T;
    makeAs<T>(className: string | {
        new (): T;
    }, name: string): T;
    makeAs<T>(className: string | {
        new (): T;
    }, name: string, attributes: Object): T;
    raw<T>(className: string | {
        new (): T;
    }): T;
    raw<T>(className: string | {
        new (): T;
    }, attributes: Object): T;
    rawOf<T>(className: string | {
        new (): T;
    }, name: string): T;
    rawOf<T>(className: string | {
        new (): T;
    }, name: string, attributes: Object): T;
}
