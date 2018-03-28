import { Collection } from 'collect.js';
export interface IFactoryBuilderCollection {
    create<T = any>(): Promise<Collection<T>>;
    create<T = any>(attributes: Object): Promise<Collection<T>>;
    make<T = any>(): Collection<T>;
    make<T = any>(attributes: Object): Collection<T>;
    raw<T = any>(): Collection<T>;
    raw<T = any>(attributes: Object): Collection<T>;
}
export interface IFactoryBuilder<Model = any> {
    times(amount: number): IFactoryBuilderCollection;
    states(state: string): this;
    states(states: string[]): this;
    states(...state: string[]): this;
    states(...states: Array<string[]>): this;
    create<T = Model>(): Promise<T>;
    create<T = Model>(attributes: Object): Promise<T>;
    make<T = Model>(): T;
    make<T = Model>(attributes: Object): T;
    raw<T = Model>(): T;
    raw<T = Model>(attributes: Object): T;
}
