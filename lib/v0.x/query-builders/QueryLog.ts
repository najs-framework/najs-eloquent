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
  pull(since: Moment.Moment): QueryLogItem[]
  pull(transform: QueryLogTransform): QueryLogItem[]
  pull(group: string, since: Moment.Moment): QueryLogItem[]
  pull(group: string, transform: QueryLogTransform): QueryLogItem[]
  pull(since: Moment.Moment, group: string): QueryLogItem[]
  pull(since: Moment.Moment, until: Moment.Moment): QueryLogItem[]
  pull(since: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  pull(transform: QueryLogTransform, since: Moment.Moment): QueryLogItem[]
  pull(transform: QueryLogTransform, group: string): QueryLogItem[]
  pull(group: string, since: Moment.Moment, until: Moment.Moment): QueryLogItem[]
  pull(group: string, since: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  pull(since: Moment.Moment, until: Moment.Moment, group: string): QueryLogItem[]
  pull(since: Moment.Moment, transform: QueryLogTransform, group: string): QueryLogItem[]
  pull(group: string, since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  pull(since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform, group: string): QueryLogItem[]
  pull(transform: QueryLogTransform, since: Moment.Moment, until: Moment.Moment, group: string): QueryLogItem[]
}

function parse_pull_arguments_1(args: ArrayLike<any>) {
  const result = {
    group: undefined,
    since: undefined,
    until: undefined,
    transform: undefined
  }

  // pull(since: Moment.Moment): QueryLogItem[]
  if (Moment.isMoment(args[0])) {
    result.since = args[0]
    return result
  }
  // pull(transform: QueryLogTransform): QueryLogItem[]
  if (isFunction(args[0])) {
    result.transform = args[0]
    return result
  }
  // pull(group: string): QueryLogItem[]
  if (isString(args[0])) {
    result.group = args[0]
    return result
  }

  return result
}

function parse_pull_arguments_2(args: ArrayLike<any>) {
  const result = {
    group: undefined,
    since: undefined,
    until: undefined,
    transform: undefined
  }

  // pull(group: string, since: Moment.Moment): QueryLogItem[]
  if (isString(args[0]) && Moment.isMoment(args[1])) {
    result.group = args[0]
    result.since = args[1]
    return result
  }
  // pull(group: string, transform: QueryLogTransform): QueryLogItem[]
  if (isString(args[0]) && isFunction(args[1])) {
    result.group = args[0]
    result.transform = args[1]
    return result
  }
  // pull(since: Moment.Moment, group: string): QueryLogItem[]
  if (Moment.isMoment(args[0]) && isString(args[1])) {
    result.since = args[0]
    result.group = args[1]
    return result
  }
  // pull(since: Moment.Moment, until: Moment.Moment): QueryLogItem[]
  if (Moment.isMoment(args[0]) && Moment.isMoment(args[1])) {
    result.since = args[0]
    result.until = args[1]
    return result
  }
  // pull(since: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  if (Moment.isMoment(args[0]) && isFunction(args[1])) {
    result.since = args[0]
    result.transform = args[1]
    return result
  }
  // pull(transform: QueryLogTransform, since: Moment.Moment): QueryLogItem[]
  if (isFunction(args[0]) && Moment.isMoment(args[1])) {
    result.transform = args[0]
    result.since = args[1]
    return result
  }
  // pull(transform: QueryLogTransform, group: string): QueryLogItem[]
  if (isFunction(args[0]) && isString(args[1])) {
    result.transform = args[0]
    result.group = args[1]
    return result
  }

  return result
}

function parse_pull_arguments_3(args: ArrayLike<any>) {
  const result = {
    group: undefined,
    since: undefined,
    until: undefined,
    transform: undefined
  }

  // pull(group: string, since: Moment.Moment, until: Moment.Moment): QueryLogItem[]
  if (isString(args[0]) && Moment.isMoment(args[1]) && Moment.isMoment(args[2])) {
    result.group = args[0]
    result.since = args[1]
    result.until = args[2]
  }
  // pull(group: string, since: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  if (isString(args[0]) && Moment.isMoment(args[1]) && isFunction(args[2])) {
    result.group = args[0]
    result.since = args[1]
    result.transform = args[2]
  }
  // pull(since: Moment.Moment, until: Moment.Moment, group: string): QueryLogItem[]
  if (Moment.isMoment(args[0]) && Moment.isMoment(args[1]) && isString(args[2])) {
    result.since = args[0]
    result.until = args[1]
    result.group = args[2]
  }
  // pull(since: Moment.Moment, transform: QueryLogTransform, group: string): QueryLogItem[]
  if (Moment.isMoment(args[0]) && isFunction(args[1]) && isString(args[2])) {
    result.since = args[0]
    result.transform = args[1]
    result.group = args[2]
  }

  return result
}

function parse_pull_arguments_4(args: ArrayLike<any>) {
  const result = {
    group: undefined,
    since: undefined,
    until: undefined,
    transform: undefined
  }

  // pull(group: string, since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
  if (isString(args[0]) && Moment.isMoment(args[1]) && Moment.isMoment(args[2]) && isFunction(args[3])) {
    result.group = args[0]
    result.since = args[1]
    result.until = args[2]
    result.transform = args[3]
  }
  // pull(since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform, group: string): QueryLogItem[]
  if (Moment.isMoment(args[0]) && Moment.isMoment(args[1]) && isFunction(args[2]) && isString(args[3])) {
    result.since = args[0]
    result.until = args[1]
    result.transform = args[2]
    result.group = args[3]
  }
  // pull(transform: QueryLogTransform, since: Moment.Moment, until: Moment.Moment, group: string): QueryLogItem[]
  if (isFunction(args[0]) && Moment.isMoment(args[1]) && Moment.isMoment(args[2]) && isString(args[3])) {
    result.transform = args[0]
    result.since = args[1]
    result.until = args[2]
    result.group = args[3]
  }

  return result
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
    const result = {
      group: undefined,
      since: undefined,
      until: undefined,
      transform: undefined
    }
    switch (args.length) {
      case 1:
        return parse_pull_arguments_1(args)
      case 2:
        return parse_pull_arguments_2(args)
      case 3:
        return parse_pull_arguments_3(args)
      case 4:
        return parse_pull_arguments_4(args)
      default:
        break
    }
    // pull(): QueryLogItem[]
    return result
  },

  pull(): any {
    if (!this.enabled) {
      return []
    }
    const pullingPipe = this.circle
    this.circle = pullingPipe === 'flip' ? 'flop' : 'flip'
    const args = this.parsePullArguments(arguments)
    const group: string | undefined = args['group']
    const since: Moment.Moment | undefined = args['since']
    const until: Moment.Moment | undefined = args['until']
    const transform: QueryLogTransform | undefined = args['transform']
    const result: QueryLogItem[] = []
    this[pullingPipe].forEach((item: QueryLogItem) => {
      let match = true
      if (group) {
        match = item.group === group
      }
      if (match && since) {
        match = item.when.isSameOrAfter(since)
      }
      if (match && until) {
        match = item.when.isSameOrBefore(until)
      }
      if (match) {
        result.push(transform ? transform(item) : item)
        return
      }
      // put not matched item back to the other pipe
      this[this.circle].push(item)
    })
    this[pullingPipe] = []
    return result.sort(function(a: QueryLogItem, b: QueryLogItem) {
      return a.when.toDate().getTime() - b.when.toDate().getTime()
    })
  }
}

export const QueryLog: QueryLogSpecs = <QueryLogSpecs>implementation
