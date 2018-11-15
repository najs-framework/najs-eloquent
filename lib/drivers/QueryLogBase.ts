import { flatten } from 'lodash'
import { QueryLog } from '../facades/global/QueryLogFacade'

export interface IQueryLogData {
  raw: string
  result?: any
  name?: string
  action?: string
  queryBuilderData: object
}

export abstract class QueryLogBase<T extends IQueryLogData> {
  protected data: T

  constructor() {
    this.data = this.getDefaultData()
  }

  abstract getDefaultData(): T

  getEmptyData(): IQueryLogData {
    return {
      raw: '',
      queryBuilderData: {}
    }
  }

  queryBuilderData(key: string, value: any): this {
    this.data.queryBuilderData[key] = value
    return this
  }

  name(name: string): this {
    this.data.name = name
    return this
  }

  action(action: string): this {
    this.data.action = action
    return this
  }

  raw(raw: any): this
  raw(...raw: any[]): this
  raw(...args: Array<any>): this {
    this.data.raw += flatten(args)
      .map(function(item) {
        if (typeof item === 'string') {
          return item
        }
        return JSON.stringify(item)
      })
      .join('')
    return this
  }

  end(result: any): any {
    this.data.result = result
    QueryLog.push(this.data)

    return result
  }
}
