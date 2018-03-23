import { Collection } from 'collect.js';
export interface IFactoryBuilderCollection {
    create<T = any>(): Promise<Collection<T>>;
    create<T = any>(attributes: Object): Promise<Collection<T>>;
    make<T = any>(): Collection<T>;
    make<T = any>(attributes: Object): Collection<T>;
    raw<T = any>(): Collection<T>;
    raw<T = any>(attributes: Object): Collection<T>;
}
export interface IFactoryBuilder {
    times(amount: number): IFactoryBuilderCollection;
    states(state: string): this;
    states(states: string[]): this;
    states(...state: string[]): this;
    states(...states: Array<string[]>): this;
    create<T = any>(): Promise<T>;
    create<T = any>(attributes: Object): Promise<T>;
    make<T = any>(): T;
    make<T = any>(attributes: Object): T;
    raw<T = any>(): T;
    raw<T = any>(attributes: Object): T;
}
