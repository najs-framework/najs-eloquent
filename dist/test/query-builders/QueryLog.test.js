"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const QueryLog_1 = require("../../lib/query-builders/QueryLog");
const Moment = require('moment');
describe('QueryLog', function () {
    describe('.enable()', function () {
        it('enables QueryLog', function () {
            expect(QueryLog_1.QueryLog.isEnabled()).toBe(false);
            QueryLog_1.QueryLog.enable();
            expect(QueryLog_1.QueryLog.isEnabled()).toBe(true);
        });
    });
    describe('.disable()', function () {
        it('disables QueryLog', function () {
            expect(QueryLog_1.QueryLog.isEnabled()).toBe(true);
            QueryLog_1.QueryLog.disable();
            expect(QueryLog_1.QueryLog.isEnabled()).toBe(false);
        });
    });
    describe('.isEnabled()', function () {
        it('can be used to check the QueryLog is enabled or not', function () {
            expect(QueryLog_1.QueryLog.isEnabled()).toBe(false);
        });
    });
    describe('.clear()', function () {
        it('clears all flip and flop pipe despite the QueryLog is enabled or not', function () {
            QueryLog_1.QueryLog.disable();
            QueryLog_1.QueryLog['flip'] = [12];
            QueryLog_1.QueryLog['flop'] = [34];
            QueryLog_1.QueryLog['circle'] = 'flip';
            QueryLog_1.QueryLog.clear();
            expect(QueryLog_1.QueryLog.isEnabled()).toBe(false);
            expect(QueryLog_1.QueryLog['flip']).toEqual([]);
            expect(QueryLog_1.QueryLog['flop']).toEqual([]);
            expect(QueryLog_1.QueryLog['circle']).toEqual('flip');
        });
    });
    describe('.push()', function () {
        it('does not work if the QueryLog is disabled', function () {
            QueryLog_1.QueryLog.push('anything');
            expect(QueryLog_1.QueryLog['flip']).toEqual([]);
            expect(QueryLog_1.QueryLog['flop']).toEqual([]);
        });
        it('pushes item to the pipe defined in this.circle', function () {
            QueryLog_1.QueryLog.enable();
            QueryLog_1.QueryLog.push('anything');
            expect(QueryLog_1.QueryLog['flip']).toHaveLength(1);
            expect(QueryLog_1.QueryLog['flop']).toEqual([]);
            QueryLog_1.QueryLog.pull();
            QueryLog_1.QueryLog.push('anything');
            expect(QueryLog_1.QueryLog['flip']).toEqual([]);
            expect(QueryLog_1.QueryLog['flop']).toHaveLength(1);
            expect(QueryLog_1.QueryLog['flop'][0].group).toEqual('all');
        });
        it('pushes item to the pipe with default group = "all"', function () {
            QueryLog_1.QueryLog.clear();
            QueryLog_1.QueryLog.push('anything');
            expect(QueryLog_1.QueryLog['flip'][0].group).toEqual('all');
            QueryLog_1.QueryLog.push('anything', 'test');
            expect(QueryLog_1.QueryLog['flip'][1].group).toEqual('test');
        });
        it('pushes item to the pipe with when = Moment.now()', function () {
            const now = new Date(1988, 1, 1);
            Moment.now = () => now;
            QueryLog_1.QueryLog.clear();
            QueryLog_1.QueryLog.push('anything');
            expect(QueryLog_1.QueryLog['flip'][0].when.toDate()).toEqual(now);
        });
    });
    describe('.pull()', function () {
        it('returns empty if the QueryLog is disabled', function () {
            QueryLog_1.QueryLog.clear();
            QueryLog_1.QueryLog.push('anything');
            QueryLog_1.QueryLog.disable();
            expect(QueryLog_1.QueryLog.pull()).toEqual([]);
            QueryLog_1.QueryLog.enable();
            expect(QueryLog_1.QueryLog.pull()).toHaveLength(1);
        });
        it('returns logs in pipe sorted by time asc', function () {
            QueryLog_1.QueryLog.clear().enable();
            Moment.now = () => new Date(2018, 1, 2);
            QueryLog_1.QueryLog.push('second');
            Moment.now = () => new Date(2018, 1, 1);
            QueryLog_1.QueryLog.push('first');
            const logs = QueryLog_1.QueryLog.pull();
            expect(logs).toHaveLength(2);
            expect(logs[0].query).toEqual('first');
            expect(logs[1].query).toEqual('second');
        });
        it('returns all logs group is undefined', function () {
            QueryLog_1.QueryLog.clear().enable();
            Moment.now = () => new Date(2018, 1, 2);
            QueryLog_1.QueryLog.push('second', 'test');
            Moment.now = () => new Date(2018, 1, 1);
            QueryLog_1.QueryLog.push('first', 'all');
            const logs = QueryLog_1.QueryLog.pull();
            expect(logs).toHaveLength(2);
            expect(logs[0].query).toEqual('first');
            expect(logs[1].query).toEqual('second');
        });
        it('filters by group if provided', function () {
            QueryLog_1.QueryLog.clear().enable();
            Moment.now = () => new Date(2018, 0, 5);
            QueryLog_1.QueryLog.push('second', 'test');
            Moment.now = () => new Date(2018, 0, 1);
            QueryLog_1.QueryLog.push('first', 'all');
            let logs = QueryLog_1.QueryLog.pull('test');
            expect(logs).toHaveLength(1);
            expect(logs[0].query).toEqual('second');
            logs = QueryLog_1.QueryLog.pull('all');
            expect(logs).toHaveLength(1);
            expect(logs[0].query).toEqual('first');
        });
        it('filters by since if provided', function () {
            QueryLog_1.QueryLog.clear().enable();
            Moment.now = () => new Date(2018, 0, 5);
            QueryLog_1.QueryLog.push('second', 'test');
            Moment.now = () => new Date(2018, 0, 10);
            QueryLog_1.QueryLog.push('third', 'test');
            Moment.now = () => new Date(2018, 0, 1);
            QueryLog_1.QueryLog.push('first', 'all');
            const logs = QueryLog_1.QueryLog.pull(Moment('2018-01-03'));
            expect(logs).toHaveLength(2);
            expect(logs[0].query).toEqual('second');
            expect(logs[1].query).toEqual('third');
        });
        it('filters by until if provided', function () {
            QueryLog_1.QueryLog.clear().enable();
            Moment.now = () => new Date(2018, 0, 5);
            QueryLog_1.QueryLog.push('second', 'test');
            Moment.now = () => new Date(2018, 0, 10);
            QueryLog_1.QueryLog.push('third', 'test');
            Moment.now = () => new Date(2018, 0, 1);
            QueryLog_1.QueryLog.push('first', 'all');
            const logs = QueryLog_1.QueryLog.pull(Moment('2018-01-03'), Moment('2018-01-07'));
            expect(logs).toHaveLength(1);
            expect(logs[0].query).toEqual('second');
        });
        it('transforms the query if provided', function () {
            QueryLog_1.QueryLog.clear().enable();
            Moment.now = () => new Date(2018, 0, 2);
            QueryLog_1.QueryLog.push('second', 'test');
            Moment.now = () => new Date(2018, 0, 1);
            QueryLog_1.QueryLog.push('first', 'all');
            const logs = QueryLog_1.QueryLog.pull(item => ({ query: item.query + '-test', when: item.when, group: item.group }));
            expect(logs).toHaveLength(2);
            expect(logs[0].query).toEqual('first-test');
            expect(logs[1].query).toEqual('second-test');
        });
        it('put back to the other pipe if not match', function () {
            QueryLog_1.QueryLog.clear().enable();
            Moment.now = () => new Date(2018, 0, 2);
            QueryLog_1.QueryLog.push('second', 'test');
            Moment.now = () => new Date(2018, 0, 1);
            QueryLog_1.QueryLog.push('first', 'all');
            const logs = QueryLog_1.QueryLog.pull('not-found');
            expect(logs).toHaveLength(0);
            expect(QueryLog_1.QueryLog['flop']).toHaveLength(2);
        });
    });
    describe('protected .parsePullArguments()', function () {
        it('returns undefined if there is all arguments is not matched', function () {
            let result = QueryLog_1.QueryLog['parsePullArguments']([1]);
            expect(result['group']).toBeUndefined();
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
            result = QueryLog_1.QueryLog['parsePullArguments']([1, 2]);
            expect(result['group']).toBeUndefined();
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
            result = QueryLog_1.QueryLog['parsePullArguments']([1, 2, 3]);
            expect(result['group']).toBeUndefined();
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
            result = QueryLog_1.QueryLog['parsePullArguments']([1, 2, 3, 4]);
            expect(result['group']).toBeUndefined();
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
            result = QueryLog_1.QueryLog['parsePullArguments']([1, 2, 3, 4, 5]);
            expect(result['group']).toBeUndefined();
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
        });
        it('pull()', function () {
            const result = QueryLog_1.QueryLog['parsePullArguments']([]);
            expect(result['group']).toBeUndefined();
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
        });
        it('pull(since: Moment.Moment)', function () {
            const since = new Moment('2018-01-01');
            const result = QueryLog_1.QueryLog['parsePullArguments']([since]);
            expect(result['group']).toBeUndefined();
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
        });
        it('pull(group: string)', function () {
            const result = QueryLog_1.QueryLog['parsePullArguments'](['test']);
            expect(result['group']).toEqual('test');
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
        });
        it('pull(transform: QueryLogTransform)', function () {
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments']([transform]);
            expect(result['group']).toBeUndefined();
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(group: string, since: Moment.Moment)', function () {
            const since = new Moment('2018-01-01');
            const result = QueryLog_1.QueryLog['parsePullArguments'](['test', since]);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
        });
        it('pull(group: string, transform: QueryLogTransform)', function () {
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments'](['test', transform]);
            expect(result['group']).toEqual('test');
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(since: Moment.Moment, group: string)', function () {
            const since = new Moment('2018-01-01');
            const result = QueryLog_1.QueryLog['parsePullArguments']([since, 'test']);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until']).toBeUndefined();
            expect(result['transform']).toBeUndefined();
        });
        it('pull(since: Moment.Moment, until: Moment.Moment)', function () {
            const since = new Moment('2018-01-01');
            const until = new Moment('2018-01-31');
            const result = QueryLog_1.QueryLog['parsePullArguments']([since, until]);
            expect(result['group']).toBeUndefined();
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until'].isSame(until)).toBe(true);
            expect(result['transform']).toBeUndefined();
        });
        it('pull(since: Moment.Moment, transform: QueryLogTransform)', function () {
            const since = new Moment('2018-01-01');
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments']([since, transform]);
            expect(result['group']).toBeUndefined();
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until']).toBeUndefined();
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(since: Moment.Moment, transform: QueryLogTransform)', function () {
            const since = new Moment('2018-01-01');
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments']([transform, since]);
            expect(result['group']).toBeUndefined();
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until']).toBeUndefined();
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(transform: QueryLogTransform, group: string)', function () {
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments']([transform, 'test']);
            expect(result['group']).toEqual('test');
            expect(result['since']).toBeUndefined();
            expect(result['until']).toBeUndefined();
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(group: string, since: Moment.Moment, until: Moment.Moment)', function () {
            const since = new Moment('2018-01-01');
            const until = new Moment('2018-01-31');
            const result = QueryLog_1.QueryLog['parsePullArguments'](['test', since, until]);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until'].isSame(until)).toBe(true);
            expect(result['transform']).toBeUndefined();
        });
        it('pull(group: string, since: Moment.Moment, transform: QueryLogTransform)', function () {
            const since = new Moment('2018-01-01');
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments'](['test', since, transform]);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until']).toBeUndefined();
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(since: Moment.Moment, until: Moment.Moment, group: string)', function () {
            const since = new Moment('2018-01-01');
            const until = new Moment('2018-01-31');
            const result = QueryLog_1.QueryLog['parsePullArguments']([since, until, 'test']);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until'].isSame(until)).toBe(true);
            expect(result['transform']).toBeUndefined();
        });
        it('pull(since: Moment.Moment, transform: QueryLogTransform, group: string)', function () {
            const since = new Moment('2018-01-01');
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments']([since, transform, 'test']);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until']).toBeUndefined();
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(group: string, since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform)', function () {
            const since = new Moment('2018-01-01');
            const until = new Moment('2018-01-31');
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments'](['test', since, until, transform]);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until'].isSame(until)).toBe(true);
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform, group: string)', function () {
            const since = new Moment('2018-01-01');
            const until = new Moment('2018-01-31');
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments']([since, until, transform, 'test']);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until'].isSame(until)).toBe(true);
            expect(result['transform'] === transform).toBe(true);
        });
        it('pull(transform: QueryLogTransform, since: Moment.Moment, until: Moment.Moment, group: string)', function () {
            const since = new Moment('2018-01-01');
            const until = new Moment('2018-01-31');
            const transform = () => { };
            const result = QueryLog_1.QueryLog['parsePullArguments']([transform, since, until, 'test']);
            expect(result['group']).toEqual('test');
            expect(result['since'].isSame(since)).toBe(true);
            expect(result['until'].isSame(until)).toBe(true);
            expect(result['transform'] === transform).toBe(true);
        });
    });
});
