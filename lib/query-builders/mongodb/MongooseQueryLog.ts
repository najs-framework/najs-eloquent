import { QueryLog } from '../../facades/global/QueryLogFacade'
import { MongooseQueryBuilder } from './MongooseQueryBuilder'
import { flatten } from 'lodash'
export class MongooseQueryLog {
  protected data: Object

  protected constructor(data: Object) {
    this.data = data
    this.data['raw'] = ''
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

  static create(queryBuilder: MongooseQueryBuilder): MongooseQueryLog {
    const log = new MongooseQueryLog(queryBuilder.toObject())
    log.data['builder'] = MongooseQueryBuilder.className
    return log
  }
}
