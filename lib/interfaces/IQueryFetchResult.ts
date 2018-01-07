import { Collection } from 'collect.js'

export interface IQueryFetchResult<T = {}> {
  // all(): Promise<Collection<T>>
  get(): Promise<Collection<any | T>>
  find(): Promise<any | null>

  pluck(value: string): Promise<Object>
  pluck(value: string, key: string): Promise<Object>

  // update(): Promise<any>
  // delete(): Promise<any>
}
