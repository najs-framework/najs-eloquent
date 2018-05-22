import { Model } from '../model/Model'
import collect from 'collect.js'

const collection = collect([])
const Collection = Object.getPrototypeOf(collection).constructor

export function isModel(value: any): boolean {
  return value instanceof Model
}

export function isCollection(value: any): boolean {
  return value instanceof Collection
}
