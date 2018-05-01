import { QueryLog } from '../../facades/global/QueryLogFacade'
import { NajsEloquent } from '../../constants'
import { IAutoload, register } from 'najs-binding'
import { flatten } from 'lodash'

export class MongooseQueryLog implements IAutoload {
  static className: string = NajsEloquent.QueryBuilder.MongooseQueryLog
  protected data: Object

  constructor(data: Object) {
    this.data = data
    this.data['raw'] = ''
  }

  getClassName() {
    return NajsEloquent.QueryBuilder.MongooseQueryLog
  }

  action(action: string): this {
    this.data['action'] = action
    return this
  }

  raw(raw: any): this
  raw(...raw: any[]): this
  raw(...args: Array<any>): this {
    this.data['raw'] += flatten(args)
      .map(function(item) {
        if (typeof item === 'string') {
          return item
        }
        return JSON.stringify(item)
      })
      .join('')
    return this
  }

  end(): void {
    QueryLog.push(this.data)
  }
}
register(MongooseQueryLog)
