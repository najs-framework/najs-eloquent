import { Eloquent } from './Eloquent'
import { EloquentMetadata } from './EloquentMetadata'

export const EloquentProxy = {
  get(target: Eloquent<any>, key: any): any {
    if (target['driver'].getDriverProxyMethods().indexOf(key) !== -1) {
      return target['driver'][key].bind(target['driver'])
    }

    if (target['driver'].getQueryProxyMethods().indexOf(key) !== -1) {
      const query = target['driver'].newQuery()
      return query[key].bind(query)
    }

    if (!EloquentMetadata.get(target).hasAttribute(key)) {
      return EloquentMetadata.get(target)['attribute'].getAttribute(target, key)
    }
    return target[key]
  },

  set(target: Eloquent<any>, key: any, value: any): any {
    if (!EloquentMetadata.get(target).hasAttribute(key)) {
      return EloquentMetadata.get(target)['attribute'].setAttribute(target, key, value)
    }

    target[key] = value
    return true
  }
}
