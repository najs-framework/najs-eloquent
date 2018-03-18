import { Eloquent } from './Eloquent'
import { EloquentMetadata } from './EloquentMetadata'

export const GET_FORWARD_TO_DRIVER_FUNCTIONS: string[] = ['is', 'getId', 'setId', 'newQuery']
export const GET_QUERY_FUNCTIONS: string[] = ['where', 'orWhere']

export const EloquentProxy = {
  get(target: Eloquent<any>, key: any, value: any): any {
    if (GET_FORWARD_TO_DRIVER_FUNCTIONS.indexOf(key) !== -1) {
      return target['driver'][key].bind(target['driver'])
    }

    if (GET_QUERY_FUNCTIONS.indexOf(key) !== -1) {
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
