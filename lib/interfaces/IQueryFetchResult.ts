import { Collection } from 'collect.js'

export interface IQueryFetchResult<T = {}> {
  all(): Promise<Collection<T>>

  // get(): Promise<Collection<Eloquent>>

  // find(): Promise<Eloquent | null>

  // pluck(): Promise<Object>

  // update(): Promise<any>
  // delete(): Promise<any>
}
