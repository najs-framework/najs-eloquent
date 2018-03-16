import { Eloquent } from './Eloquent'
import { EloquentMetadata } from './EloquentMetadata'

export const EloquentProxy = {
  get(target: Eloquent, key: any, value: any): any {
    if (EloquentMetadata.get(target).hasAttribute(key)) {
    }
    return target[key]
  },

  set(target: Eloquent, key: any, value: any): any {
    if (EloquentMetadata.get(target).hasAttribute(key)) {
    }
    target[key] = value
    return true
  }
}
