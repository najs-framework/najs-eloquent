export interface IFactoryBuilder {
  times(amount: number): this

  states(states: string): this

  create<T = any>(): Promise<T>
  create<T = any>(attributes: Object): Promise<T>

  make<T = any>(): T
  make<T = any>(attributes: Object): T

  raw<T = any>(): T
  raw<T = any>(attributes: Object): T
}
