import { QueryLogItem } from './QueryLog'
import * as Moment from 'moment'
import { isString, isFunction } from 'lodash'

export type QueryLogItem = {
  query: any
  when: Moment.Moment
  group: string
}

export type QueryLogTransform = (item: QueryLogItem) => QueryLogItem

export type QueryLogSpecs = {
  isEnabled(): boolean
  enable(): QueryLogSpecs
  disable(): QueryLogSpecs
  clear(): QueryLogSpecs

  push(query: any): QueryLogSpecs
  push(query: any, group: string): QueryLogSpecs

  pull(): QueryLogItem[]
  pull(group: string): QueryLogItem[]
  pull(group: string, since: Moment.Moment): QueryLogItem[]
  pull(group: string, since: Moment.Moment, until: Moment.Moment): QueryLogItem[]
  pull(group: string, since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  pull(group: string, since: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  pull(group: string, transform: QueryLogTransform): QueryLogItem[]
  pull(since: Moment.Moment): QueryLogItem[]
  pull(since: Moment.Moment, group: string): QueryLogItem[]
  pull(since: Moment.Moment, until: Moment.Moment): QueryLogItem[]
  pull(since: Moment.Moment, until: Moment.Moment, group: string): QueryLogItem[]
  pull(since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform, group: string): QueryLogItem[]
  pull(since: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  pull(since: Moment.Moment, transform: QueryLogTransform, group: string): QueryLogItem[]
  pull(transform: QueryLogTransform): QueryLogItem[]
  pull(transform: QueryLogTransform, group: string): QueryLogItem[]
  pull(transform: QueryLogTransform, since: Moment.Moment): QueryLogItem[]
  pull(transform: QueryLogTransform, since: Moment.Moment, group: string): QueryLogItem[]
  pull(transform: QueryLogTransform, since: Moment.Moment, until: Moment.Moment, group: string): QueryLogItem[]
}

const implementation: any = {
  // we are using 2 pipes to ensure that the item is never miss when pulling or pushing at the same time
  // the strategy is:
  //   1) always .push() to 1 pipe (flip or flop)
  //   2) when .pull() is called, swap current pushing pipe and process .pull() in the others
  //   3) with not matched items they will be pushed back to the current pushing pipe
  flip: [],
  flop: [],
  circle: 'flip',
  enabled: false,

  isEnabled(): boolean {
    return this.enabled
  },

  enable(): any {
    this.enabled = true
    return this
  },

  disable(): any {
    this.enabled = false
    return this
  },

  clear(): any {
    this.flip = []
    this.flop = []
    this.circle = 'flip'
    return this
  },

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
  },

  parsePullArguments(args: ArrayLike<any>): any {
    if (isString(args[0])) {
      return {
        group: args[0],
        since: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
        until: args[2] && Moment.isMoment(args[2]) ? args[2] : undefined,
        transform: args[args.length - 1] && isFunction(args[args.length - 1]) ? args[args.length - 1] : undefined
      }
    }
    if (Moment.isMoment(args[0])) {
      return {
        since: args[0],
        until: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
        group: args[args.length - 1] && isString(args[args.length - 1]) ? args[args.length - 1] : undefined,
        transform: args[1] && isFunction(args[1]) ? args[1] : args[2] && isFunction(args[2]) ? args[2] : undefined
      }
    }
    if (isFunction(args[0])) {
      return {
        transform: args[0],
        group: args[args.length - 1] && isString(args[args.length - 1]) ? args[args.length - 1] : undefined,
        since: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
        until: args[2] && Moment.isMoment(args[2]) ? args[2] : undefined
      }
    }
    return {}
  },

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

export const QueryLog: QueryLogSpecs = <QueryLogSpecs>implementation
