import { Collection } from 'collect.js'

export interface IQueryFetchResult<T = {}> {
  // all(): Promise<Collection<T>>
  get(): Promise<Collection<any | T>>
  find(): Promise<any | null>
  // pluck(): Promise<Object>
  // update(): Promise<any>
  // delete(): Promise<any>
}
