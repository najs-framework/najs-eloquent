/// <reference path="../definitions/collect.js/index.d.ts" />

const collect = require('collect.js')

export function make_collection(data: object): CollectJs.Collection<object>
export function make_collection<T>(data: T[]): CollectJs.Collection<T>
export function make_collection<T, R>(data: T[], converter: (item: T) => R): CollectJs.Collection<R>
export function make_collection<T, R>(data: T[], converter?: (item: T) => R): CollectJs.Collection<R> {
  if (typeof converter === 'undefined') {
    return collect(data)
  }
  return collect(data.map(converter))
}
