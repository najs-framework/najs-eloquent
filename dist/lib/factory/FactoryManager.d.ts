/// <reference types="chance" />
import { Facade } from 'najs-facade';
import { IAutoload } from 'najs-binding';
import { Eloquent } from '../model/Eloquent';
import { IFactoryBuilder } from './interfaces/IFactoryBuilder';
import { IFactoryManager, IFactoryDefinition, ModelClass } from './interfaces/IFactoryManager';
export declare type ChanceFaker = Chance.Chance;
export declare class FactoryManager extends Facade implements IAutoload, IFactoryManager<ChanceFaker> {
    static className: string;
    protected faker: ChanceFaker;
    protected definitions: Object;
    protected states: Object;
    constructor();
    getClassName(): string;
    protected addDefinition(bag: string, className: any, name: string, definition: any): this;
    private parseModelName(className);
    define(className: string | ModelClass<Eloquent>, definition: IFactoryDefinition<ChanceFaker>, name?: string): this;
    defineAs(className: string | ModelClass<Eloquent>, name: string, definition: IFactoryDefinition<ChanceFaker>): this;
    state(className: string | ModelClass<Eloquent>, state: string, definition: IFactoryDefinition<ChanceFaker>): this;
    of<T>(className: string | ModelClass<T>): IFactoryBuilder<T>;
    of<T>(className: string | ModelClass<T>, name: string): IFactoryBuilder<T>;
    create<T>(className: string | ModelClass<T>): T;
    create<T>(className: string | ModelClass<T>, attributes: Object): T;
    createAs<T>(className: string | ModelClass<T>, name: string): T;
    createAs<T>(className: string | ModelClass<T>, name: string, attributes: Object): T;
    make<T>(className: string | ModelClass<T>): T;
    make<T>(className: string | ModelClass<T>, attributes: Object): T;
    makeAs<T>(className: string | ModelClass<T>, name: string): T;
    makeAs<T>(className: string | ModelClass<T>, name: string, attributes: Object): T;
    raw<T>(className: string | ModelClass<T>): T;
    raw<T>(className: string | ModelClass<T>, attributes: Object): T;
    rawOf<T>(className: string | ModelClass<T>, name: string): T;
    rawOf<T>(className: string | ModelClass<T>, name: string, attributes: Object): T;
}
