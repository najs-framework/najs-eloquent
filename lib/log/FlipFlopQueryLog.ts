import * as Moment from 'moment'
import { register, IAutoload } from 'najs-binding'
import { Facade } from 'najs-facade'
import { NajsEloquentClass } from '../constants'
import { IQueryLog, QueryLogItem } from './interfaces/IQueryLog'
import { isString, isFunction } from 'lodash'

export class FlipFlopQueryLog extends Facade implements IQueryLog, IAutoload {
  static className: string = NajsEloquentClass.QueryLog
  protected flip: QueryLogItem[]
  protected flop: QueryLogItem[]
  protected circle: 'flip' | 'flop'
  protected enabled: boolean

  constructor() {
    super()
    this.flip = []
    this.flop = []
    this.circle = 'flip'
    this.enabled = false
  }

  getClassName() {
    return FlipFlopQueryLog.className
  }

  protected assign_if_last_argument_is(type: string, args: ArrayLike<any>) {
    return typeof args[args.length - 1] === type ? args[args.length - 1] : undefined
  }

  protected parse_pull_arguments_starts_with_string(args: ArrayLike<any>) {
    return {
      group: args[0],
      since: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
      until: args[2] && Moment.isMoment(args[2]) ? args[2] : undefined,
      transform: this.assign_if_last_argument_is('function', args)
    }
  }

  protected parse_pull_arguments_starts_with_moment(args: ArrayLike<any>) {
    return {
      since: args[0],
      until: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
      group: this.assign_if_last_argument_is('string', args),
      transform: args[1] && isFunction(args[1]) ? args[1] : args[2] && isFunction(args[2]) ? args[2] : undefined
    }
  }

  protected parse_pull_arguments_starts_with_function(args: ArrayLike<any>) {
    return {
      transform: args[0],
      group: this.assign_if_last_argument_is('string', args),
      since: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
      until: args[2] && Moment.isMoment(args[2]) ? args[2] : undefined
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  enable(): any {
    this.enabled = true
    return this
  }

  disable(): any {
    this.enabled = false
    return this
  }

  clear(): any {
    this.flip = []
    this.flop = []
    this.circle = 'flip'
    return this
  }

  push(query: any, group: string = 'all'): any {
    if (!this.enabled) {
      return this
    }
    this[this.circle].push({
      query: query,
      when: Moment(),
      group: group
    })
    return this
  }

  parsePullArguments(args: ArrayLike<any>): any {
    if (isString(args[0])) {
      return this.parse_pull_arguments_starts_with_string(args)
    }
    if (Moment.isMoment(args[0])) {
      return this.parse_pull_arguments_starts_with_moment(args)
    }
    if (isFunction(args[0])) {
      return this.parse_pull_arguments_starts_with_function(args)
    }
    return {}
  }

  pull(): any {
    if (!this.enabled) {
      return []
    }
    const pullingPipe = this.circle
    this.circle = pullingPipe === 'flip' ? 'flop' : 'flip'
    const args = this.parsePullArguments(arguments)
    const result: QueryLogItem[] = []
    this[pullingPipe].forEach((item: QueryLogItem) => {
      let match = true
      if (args['group']) {
        match = item.group === args['group']
      }
      if (match && args['since']) {
        match = item.when.isSameOrAfter(args['since'])
      }
      if (match && args['until']) {
        match = item.when.isSameOrBefore(args['until'])
      }
      if (match) {
        result.push(args['transform'] ? args['transform'](item) : item)
        return
      }
      this[this.circle].push(item) // put not matched item back to the other pipe
    })
    this[pullingPipe] = []
    return result.sort(function(a: QueryLogItem, b: QueryLogItem) {
      return a.when.toDate().getTime() - b.when.toDate().getTime()
    })
  }
}
register(FlipFlopQueryLog)
