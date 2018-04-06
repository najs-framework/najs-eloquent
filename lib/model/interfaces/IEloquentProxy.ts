import { Eloquent } from '../Eloquent'

export interface IEloquentProxy {
  getProxyName(): string

  isGetter(model: Eloquent, key: string | symbol): boolean

  get(model: Eloquent, key: string | symbol): any

  isSetter(model: Eloquent, key: string | symbol, value: any): boolean

  set(model: Eloquent, key: string | symbol, value: any): boolean
}
