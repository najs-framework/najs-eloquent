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

function assign_if_last_argument_is(type: string, args: ArrayLike<any>) {
  return typeof args[args.length - 1] === type ? args[args.length - 1] : undefined
}

function parse_pull_arguments_starts_with_string(args: ArrayLike<any>) {
  return {
    group: args[0],
    since: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
    until: args[2] && Moment.isMoment(args[2]) ? args[2] : undefined,
    transform: assign_if_last_argument_is('function', args)
  }
}

function parse_pull_arguments_starts_with_moment(args: ArrayLike<any>) {
  return {
    since: args[0],
    until: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
    group: assign_if_last_argument_is('string', args),
    transform: args[1] && isFunction(args[1]) ? args[1] : args[2] && isFunction(args[2]) ? args[2] : undefined
  }
}

function parse_pull_arguments_starts_with_function(args: ArrayLike<any>) {
  return {
    transform: args[0],
    group: assign_if_last_argument_is('string', args),
    since: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
    until: args[2] && Moment.isMoment(args[2]) ? args[2] : undefined
  }
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
      return parse_pull_arguments_starts_with_string(args)
    }
    if (Moment.isMoment(args[0])) {
      return parse_pull_arguments_starts_with_moment(args)
    }
    if (isFunction(args[0])) {
      return parse_pull_arguments_starts_with_function(args)
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
