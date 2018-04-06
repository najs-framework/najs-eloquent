import { Collection } from 'collect.js'

export interface IFetchResultQuery<T = {}> {
  get(): Promise<Collection<T>>
  all(): Promise<Collection<T>>

  find(): Promise<T | null>
  find(id: any): Promise<T | null>

  first(): Promise<T | null>
  first(id: any): Promise<T | null>

  count(): Promise<number>

  pluck(value: string): Promise<Object>
  pluck(value: string, key: string): Promise<Object>

  update(data: Object): Promise<Object>
  delete(): Promise<Object>
  restore(): Promise<Object>

  execute(): Promise<any>
}
