import * as Moment from 'moment'

export type QueryLogTransform = (item: QueryLogItem) => QueryLogItem

export type QueryLogItem = {
  query: any
  when: Moment.Moment
  group: string
}

export interface IQueryLog {
  isEnabled(): boolean
  enable(): this
  disable(): this
  clear(): this

  push(query: any): this
  push(query: any, group: string): this

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
