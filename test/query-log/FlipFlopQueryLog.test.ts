/// <reference path="../../lib/index.ts" />

import 'jest'
import { NajsEloquent } from '../../lib/constants'
import { Facade } from 'najs-facade'
import { FlipFlopQueryLog } from '../../lib/query-log/FlipFlopQueryLog'
import { MomentProvider } from '../../lib/facades/global/MomentProviderFacade'

describe('FlipFlopQueryLog', function() {
  const QueryLog: Najs.Contracts.Eloquent.QueryLog = new FlipFlopQueryLog()

  it('extends Facade class, implements IAutoload', function() {
    expect(QueryLog).toBeInstanceOf(Facade)
    expect(QueryLog['getClassName']()).toEqual(NajsEloquent.QueryLog.FlipFlopQueryLog)
  })

  describe('.enable()', function() {
    it('enables QueryLog', function() {
      expect(QueryLog.isEnabled()).toBe(false)
      QueryLog.enable()
      expect(QueryLog.isEnabled()).toBe(true)
    })
  })

  describe('.disable()', function() {
    it('disables QueryLog', function() {
      expect(QueryLog.isEnabled()).toBe(true)
      QueryLog.disable()
      expect(QueryLog.isEnabled()).toBe(false)
    })
  })

  describe('.isEnabled()', function() {
    it('can be used to check the QueryLog is enabled or not', function() {
      expect(QueryLog.isEnabled()).toBe(false)
    })
  })

  describe('.clear()', function() {
    it('clears all flip and flop pipe despite the QueryLog is enabled or not', function() {
      QueryLog.disable()
      QueryLog['flip'] = [12]
      QueryLog['flop'] = [34]
      QueryLog['circle'] = 'flip'
      QueryLog.clear()
      expect(QueryLog.isEnabled()).toBe(false)
      expect(QueryLog['flip']).toEqual([])
      expect(QueryLog['flop']).toEqual([])
      expect(QueryLog['circle']).toEqual('flip')
    })
  })

  describe('.push()', function() {
    it('does not work if the QueryLog is disabled', function() {
      QueryLog.push('anything')
      expect(QueryLog['flip']).toEqual([])
      expect(QueryLog['flop']).toEqual([])
    })

    it('pushes item to the pipe defined in this.circle', function() {
      QueryLog.enable()
      QueryLog.push('anything')
      expect(QueryLog['flip']).toHaveLength(1)
      expect(QueryLog['flop']).toEqual([])
      QueryLog.pull()
      QueryLog.push('anything')
      expect(QueryLog['flip']).toEqual([])
      expect(QueryLog['flop']).toHaveLength(1)
      expect(QueryLog['flop'][0].group).toEqual('all')
    })

    it('pushes item to the pipe with default group = "all"', function() {
      QueryLog.clear()
      QueryLog.push('anything')
      expect(QueryLog['flip'][0].group).toEqual('all')

      QueryLog.push('anything', 'test')
      expect(QueryLog['flip'][1].group).toEqual('test')
    })

    it('pushes item to the pipe with when = Moment.now()', function() {
      const now = new Date(1988, 1, 1)
      MomentProvider.setNow(() => now)
      QueryLog.clear()
      QueryLog.push('anything')
      expect(QueryLog['flip'][0].when.toDate()).toEqual(now)
    })
  })

  describe('.pull()', function() {
    it('returns empty if the QueryLog is disabled', function() {
      QueryLog.clear()
      QueryLog.push('anything')
      QueryLog.disable()
      expect(QueryLog.pull()).toEqual([])
      QueryLog.enable()
      expect(QueryLog.pull()).toHaveLength(1)
    })

    it('returns logs in pipe sorted by time asc', function() {
      QueryLog.clear().enable()
      MomentProvider.setNow(() => new Date(2018, 1, 2))
      QueryLog.push('second')
      MomentProvider.setNow(() => new Date(2018, 1, 1))
      QueryLog.push('first')
      const logs = QueryLog.pull()
      expect(logs).toHaveLength(2)
      expect(logs[0].data).toEqual('first')
      expect(logs[1].data).toEqual('second')
    })

    it('returns all logs group is undefined', function() {
      QueryLog.clear().enable()
      MomentProvider.setNow(() => new Date(2018, 1, 2))
      QueryLog.push('second', 'test')
      MomentProvider.setNow(() => new Date(2018, 1, 1))
      QueryLog.push('first', 'all')
      const logs = QueryLog.pull()
      expect(logs).toHaveLength(2)
      expect(logs[0].data).toEqual('first')
      expect(logs[1].data).toEqual('second')
    })

    it('filters by group if provided', function() {
      QueryLog.clear().enable()
      MomentProvider.setNow(() => new Date(2018, 0, 5))
      QueryLog.push('second', 'test')
      MomentProvider.setNow(() => new Date(2018, 0, 1))
      QueryLog.push('first', 'all')
      let logs = QueryLog.pull('test')
      expect(logs).toHaveLength(1)
      expect(logs[0].data).toEqual('second')
      logs = QueryLog.pull('all')
      expect(logs).toHaveLength(1)
      expect(logs[0].data).toEqual('first')
    })

    it('filters by since if provided', function() {
      QueryLog.clear().enable()
      MomentProvider.setNow(() => new Date(2018, 0, 5))
      QueryLog.push('second', 'test')
      MomentProvider.setNow(() => new Date(2018, 0, 10))
      QueryLog.push('third', 'test')
      MomentProvider.setNow(() => new Date(2018, 0, 1))
      QueryLog.push('first', 'all')
      const logs = QueryLog.pull(MomentProvider.make('2018-01-03'))
      expect(logs).toHaveLength(2)
      expect(logs[0].data).toEqual('second')
      expect(logs[1].data).toEqual('third')
    })

    it('filters by until if provided', function() {
      QueryLog.clear().enable()
      MomentProvider.setNow(() => new Date(2018, 0, 5))
      QueryLog.push('second', 'test')
      MomentProvider.setNow(() => new Date(2018, 0, 10))
      QueryLog.push('third', 'test')
      MomentProvider.setNow(() => new Date(2018, 0, 1))
      QueryLog.push('first', 'all')
      const logs = QueryLog.pull(MomentProvider.make('2018-01-03'), MomentProvider.make('2018-01-07'))
      expect(logs).toHaveLength(1)
      expect(logs[0].data).toEqual('second')
    })

    it('transforms the query if provided', function() {
      QueryLog.clear().enable()
      MomentProvider.setNow(() => new Date(2018, 0, 2))
      QueryLog.push('second', 'test')
      MomentProvider.setNow(() => new Date(2018, 0, 1))
      QueryLog.push('first', 'all')
      const logs = QueryLog.pull((item: any) => ({ data: item.data + '-test', when: item.when, group: item.group }))
      expect(logs).toHaveLength(2)
      expect(logs[0].data).toEqual('first-test')
      expect(logs[1].data).toEqual('second-test')
    })

    it('put back to the other pipe if not match', function() {
      QueryLog.clear().enable()
      MomentProvider.setNow(() => new Date(2018, 0, 2))
      QueryLog.push('second', 'test')
      MomentProvider.setNow(() => new Date(2018, 0, 1))
      QueryLog.push('first', 'all')
      const logs = QueryLog.pull('not-found')
      expect(logs).toHaveLength(0)
      expect(QueryLog['flop']).toHaveLength(2)
    })
  })

  describe('protected .parsePullArguments()', function() {
    it('returns undefined if there is all arguments is not matched', function() {
      let result = QueryLog['parsePullArguments']([1])
      expect(result['group']).toBeUndefined()
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()

      result = QueryLog['parsePullArguments']([1, 2])
      expect(result['group']).toBeUndefined()
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()

      result = QueryLog['parsePullArguments']([1, 2, 3])
      expect(result['group']).toBeUndefined()
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()

      result = QueryLog['parsePullArguments']([1, 2, 3, 4])
      expect(result['group']).toBeUndefined()
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()

      result = QueryLog['parsePullArguments']([1, 2, 3, 4, 5])
      expect(result['group']).toBeUndefined()
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()
    })

    it('pull()', function() {
      const result = QueryLog['parsePullArguments']([])
      expect(result['group']).toBeUndefined()
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()
    })

    it('pull(group: string)', function() {
      const result = QueryLog['parsePullArguments'](['test'])
      expect(result['group']).toEqual('test')
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()
    })

    it('pull(group: string, since: Moment.Moment)', function() {
      const since = MomentProvider.make('2018-01-01')
      const result = QueryLog['parsePullArguments'](['test', since])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()
    })

    it('pull(group: string, since: Moment.Moment, until: Moment.Moment)', function() {
      const since = MomentProvider.make('2018-01-01')
      const until = MomentProvider.make('2018-01-31')
      const result = QueryLog['parsePullArguments'](['test', since, until])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until'].isSame(until)).toBe(true)
      expect(result['transform']).toBeUndefined()
    })

    it('pull(group: string, since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform)', function() {
      const since = MomentProvider.make('2018-01-01')
      const until = MomentProvider.make('2018-01-31')
      const transform = () => {}
      const result = QueryLog['parsePullArguments'](['test', since, until, transform])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until'].isSame(until)).toBe(true)
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(group: string, since: Moment.Moment, transform: QueryLogTransform)', function() {
      const since = MomentProvider.make('2018-01-01')
      const transform = () => {}
      const result = QueryLog['parsePullArguments'](['test', since, transform])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until']).toBeUndefined()
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(group: string, transform: QueryLogTransform)', function() {
      const transform = () => {}
      const result = QueryLog['parsePullArguments'](['test', transform])
      expect(result['group']).toEqual('test')
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(since: Moment.Moment)', function() {
      const since = MomentProvider.make('2018-01-01')
      const result = QueryLog['parsePullArguments']([since])
      expect(result['group']).toBeUndefined()
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()
    })

    it('pull(since: Moment.Moment, group: string)', function() {
      const since = MomentProvider.make('2018-01-01')
      const result = QueryLog['parsePullArguments']([since, 'test'])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until']).toBeUndefined()
      expect(result['transform']).toBeUndefined()
    })

    it('pull(since: Moment.Moment, until: Moment.Moment)', function() {
      const since = MomentProvider.make('2018-01-01')
      const until = MomentProvider.make('2018-01-31')
      const result = QueryLog['parsePullArguments']([since, until])
      expect(result['group']).toBeUndefined()
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until'].isSame(until)).toBe(true)
      expect(result['transform']).toBeUndefined()
    })

    it('pull(since: Moment.Moment, until: Moment.Moment, group: string)', function() {
      const since = MomentProvider.make('2018-01-01')
      const until = MomentProvider.make('2018-01-31')
      const result = QueryLog['parsePullArguments']([since, until, 'test'])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until'].isSame(until)).toBe(true)
      expect(result['transform']).toBeUndefined()
    })

    it('pull(since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform, group: string)', function() {
      const since = MomentProvider.make('2018-01-01')
      const until = MomentProvider.make('2018-01-31')
      const transform = () => {}
      const result = QueryLog['parsePullArguments']([since, until, transform, 'test'])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until'].isSame(until)).toBe(true)
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(since: Moment.Moment, transform: QueryLogTransform)', function() {
      const since = MomentProvider.make('2018-01-01')
      const transform = () => {}
      const result = QueryLog['parsePullArguments']([since, transform])
      expect(result['group']).toBeUndefined()
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until']).toBeUndefined()
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(since: Moment.Moment, transform: QueryLogTransform, group: string)', function() {
      const since = MomentProvider.make('2018-01-01')
      const transform = () => {}
      const result = QueryLog['parsePullArguments']([since, transform, 'test'])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until']).toBeUndefined()
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(transform: QueryLogTransform)', function() {
      const transform = () => {}
      const result = QueryLog['parsePullArguments']([transform])
      expect(result['group']).toBeUndefined()
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(transform: QueryLogTransform, group: string)', function() {
      const transform = () => {}
      const result = QueryLog['parsePullArguments']([transform, 'test'])
      expect(result['group']).toEqual('test')
      expect(result['since']).toBeUndefined()
      expect(result['until']).toBeUndefined()
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(transform: QueryLogTransform, since: Moment.Moment)', function() {
      const since = MomentProvider.make('2018-01-01')
      const transform = () => {}
      const result = QueryLog['parsePullArguments']([transform, since])
      expect(result['group']).toBeUndefined()
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until']).toBeUndefined()
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(transform: QueryLogTransform, since: Moment.Moment, group: string)', function() {
      const since = MomentProvider.make('2018-01-01')
      const transform = () => {}
      const result = QueryLog['parsePullArguments']([transform, since, 'test'])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until']).toBeUndefined()
      expect(result['transform'] === transform).toBe(true)
    })

    it('pull(transform: QueryLogTransform, since: Moment.Moment, until: Moment.Moment, group: string)', function() {
      const since = MomentProvider.make('2018-01-01')
      const until = MomentProvider.make('2018-01-31')
      const transform = () => {}
      const result = QueryLog['parsePullArguments']([transform, since, until, 'test'])
      expect(result['group']).toEqual('test')
      expect(result['since'].isSame(since)).toBe(true)
      expect(result['until'].isSame(until)).toBe(true)
      expect(result['transform'] === transform).toBe(true)
    })
  })
})
