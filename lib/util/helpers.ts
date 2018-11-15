import { Model } from '../model/Model'
import collect from 'collect.js'
import { ObjectId } from 'bson'

const collection = collect([])
const Collection = Object.getPrototypeOf(collection).constructor

export function isModel(value: any): boolean {
  return value instanceof Model || (!!value && value._isNajsEloquentModel === true)
}

export function isObjectId(value: any): boolean {
  if (value instanceof ObjectId) {
    return true
  }

  if (!value || typeof value !== 'object') {
    return false
  }

  return typeof value.toHexString === 'function' || value._bsontype === 'ObjectId' || value._bsontype === 'ObjectID'
}

export function isCollection(value: any): boolean {
  return value instanceof Collection
}

export function distinctModelByClassInCollection(collection: CollectJs.Collection<Model>) {
  const result: Model[] = []
  if (!isCollection(collection) || collection.isEmpty()) {
    return result
  }

  const collected = {}
  for (let i = 0, l = collection.count(); i < l; i++) {
    const model = collection.get(i)!
    if (collected[model.getModelName()] === true) {
      continue
    }
    collected[model.getModelName()] = true
    result.push(model)
  }
  return result
}
