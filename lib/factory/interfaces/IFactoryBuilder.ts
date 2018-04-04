import { Collection } from 'collect.js'

export interface IFactoryBuilderCollection<Model> {
  states(state: string): this
  states(states: string[]): this
  states(...state: string[]): this
  states(...states: Array<string[]>): this

  create<T = Model>(): Promise<Collection<T>>
  create<T = Model>(attributes: Object): Promise<Collection<T>>

  make<T = Model>(): Collection<T>
  make<T = Model>(attributes: Object): Collection<T>

  raw<T = Model>(): Collection<T>
  raw<T = Model>(attributes: Object): Collection<T>
}

export interface IFactoryBuilder<Model> {
  times(amount: number): IFactoryBuilderCollection<Model>

  states(state: string): this
  states(states: string[]): this
  states(...state: string[]): this
  states(...states: Array<string[]>): this

  create<T = Model>(): Promise<T>
  create<T = Model>(attributes: Object): Promise<T>

  make<T = Model>(): T
  make<T = Model>(attributes: Object): T

  raw<T = Model>(): T
  raw<T = Model>(attributes: Object): T
}
