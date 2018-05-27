/// <reference path="../../../lib/collect.js/index.d.ts" />
declare namespace Najs.Contracts.Eloquent {
    interface FactoryBuilderCollection<Model> {
        states(state: string): this;
        states(states: string[]): this;
        states(...state: string[]): this;
        states(...states: Array<string[]>): this;
        create<T = Model>(): Promise<CollectJs.Collection<T>>;
        create<T = Model>(attributes: Object): Promise<CollectJs.Collection<T>>;
        make<T = Model>(): CollectJs.Collection<T>;
        make<T = Model>(attributes: Object): CollectJs.Collection<T>;
        raw<T = Model>(): CollectJs.Collection<T>;
        raw<T = Model>(attributes: Object): CollectJs.Collection<T>;
    }
    interface FactoryBuilder<Model> {
        times(amount: number): FactoryBuilderCollection<Model>;
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
}
