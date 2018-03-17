import { Eloquent } from './Eloquent'
import { EloquentMetadata } from './EloquentMetadata'

const GET_FORWARD_TO_DRIVER_FUNCTIONS: string[] = ['is', 'getId', 'setId', 'newQuery', 'toObject', 'toJSON']

const GET_QUERY_FUNCTIONS: string[] = ['where', 'orWhere']

export const EloquentProxy = {
  get(target: Eloquent<any>, key: any, value: any): any {
    if (GET_FORWARD_TO_DRIVER_FUNCTIONS.indexOf(key)) {
      return target['driver'][key]
    }

    if (GET_QUERY_FUNCTIONS.indexOf(key)) {
      return target['driver'].newQuery()[key]
    }

    if (EloquentMetadata.get(target).hasAttribute(key)) {
    }
    return target[key]
  },

  set(target: Eloquent<any>, key: any, value: any): any {
    if (EloquentMetadata.get(target).hasAttribute(key)) {
    }
    target[key] = value
    return true
  }
}
