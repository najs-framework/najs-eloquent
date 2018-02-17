"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = require("moment");
const lodash_1 = require("lodash");
const implementation = {
    // we are using 2 pipes to ensure that the item is never miss when pulling or pushing at the same time
    // the strategy is:
    //   1) always .push() to 1 pipe (flip or flop)
    //   2) when .pull() is called, swap current pushing pipe and process .pull() in the others
    //   3) with not matched items they will be pushed back to the current pushing pipe
    flip: [],
    flop: [],
    circle: 'flip',
    enabled: false,
    isEnabled() {
        return this.enabled;
    },
    enable() {
        this.enabled = true;
        return this;
    },
    disable() {
        this.enabled = false;
        return this;
    },
    clear() {
        this.flip = [];
        this.flop = [];
        this.circle = 'flip';
        return this;
    },
    push(query, group = 'all') {
        if (!this.enabled) {
            return this;
        }
        this[this.circle].push({
            query: query,
            when: Moment(),
            group: group
        });
        return this;
    },
    parsePullArguments(args) {
        const result = {
            group: undefined,
            since: undefined,
            until: undefined,
            transform: undefined
        };
        switch (args.length) {
            case 1:
                // pull(since: Moment.Moment): QueryLogItem[]
                if (Moment.isMoment(args[0])) {
                    result.since = args[0];
                    return result;
                }
                // pull(transform: QueryLogTransform): QueryLogItem[]
                if (lodash_1.isFunction(args[0])) {
                    result.transform = args[0];
                    return result;
                }
                // pull(group: string): QueryLogItem[]
                if (lodash_1.isString(args[0])) {
                    result.group = args[0];
                    return result;
                }
                break;
            case 2:
                // pull(group: string, since: Moment.Moment): QueryLogItem[]
                if (lodash_1.isString(args[0]) && Moment.isMoment(args[1])) {
                    result.group = args[0];
                    result.since = args[1];
                    return result;
                }
                // pull(group: string, transform: QueryLogTransform): QueryLogItem[]
                if (lodash_1.isString(args[0]) && lodash_1.isFunction(args[1])) {
                    result.group = args[0];
                    result.transform = args[1];
                    return result;
                }
                // pull(since: Moment.Moment, group: string): QueryLogItem[]
                if (Moment.isMoment(args[0]) && lodash_1.isString(args[1])) {
                    result.since = args[0];
                    result.group = args[1];
                    return result;
                }
                // pull(since: Moment.Moment, until: Moment.Moment): QueryLogItem[]
                if (Moment.isMoment(args[0]) && Moment.isMoment(args[1])) {
                    result.since = args[0];
                    result.until = args[1];
                    return result;
                }
                // pull(since: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
                if (Moment.isMoment(args[0]) && lodash_1.isFunction(args[1])) {
                    result.since = args[0];
                    result.transform = args[1];
                    return result;
                }
                // pull(transform: QueryLogTransform, since: Moment.Moment): QueryLogItem[]
                if (lodash_1.isFunction(args[0]) && Moment.isMoment(args[1])) {
                    result.transform = args[0];
                    result.since = args[1];
                    return result;
                }
                // pull(transform: QueryLogTransform, group: string): QueryLogItem[]
                if (lodash_1.isFunction(args[0]) && lodash_1.isString(args[1])) {
                    result.transform = args[0];
                    result.group = args[1];
                    return result;
                }
                break;
            case 3:
                // pull(group: string, since: Moment.Moment, until: Moment.Moment): QueryLogItem[]
                if (lodash_1.isString(args[0]) && Moment.isMoment(args[1]) && Moment.isMoment(args[2])) {
                    result.group = args[0];
                    result.since = args[1];
                    result.until = args[2];
                }
                // pull(group: string, since: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
                if (lodash_1.isString(args[0]) && Moment.isMoment(args[1]) && lodash_1.isFunction(args[2])) {
                    result.group = args[0];
                    result.since = args[1];
                    result.transform = args[2];
                }
                // pull(since: Moment.Moment, until: Moment.Moment, group: string): QueryLogItem[]
                if (Moment.isMoment(args[0]) && Moment.isMoment(args[1]) && lodash_1.isString(args[2])) {
                    result.since = args[0];
                    result.until = args[1];
                    result.group = args[2];
                }
                // pull(since: Moment.Moment, transform: QueryLogTransform, group: string): QueryLogItem[]
                if (Moment.isMoment(args[0]) && lodash_1.isFunction(args[1]) && lodash_1.isString(args[2])) {
                    result.since = args[0];
                    result.transform = args[1];
                    result.group = args[2];
                }
                break;
            case 4:
                // pull(group: string, since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform): QueryLogItem[]
                if (lodash_1.isString(args[0]) && Moment.isMoment(args[1]) && Moment.isMoment(args[2]) && lodash_1.isFunction(args[3])) {
                    result.group = args[0];
                    result.since = args[1];
                    result.until = args[2];
                    result.transform = args[3];
                }
                // pull(since: Moment.Moment, until: Moment.Moment, transform: QueryLogTransform, group: string): QueryLogItem[]
                if (Moment.isMoment(args[0]) && Moment.isMoment(args[1]) && lodash_1.isFunction(args[2]) && lodash_1.isString(args[3])) {
                    result.since = args[0];
                    result.until = args[1];
                    result.transform = args[2];
                    result.group = args[3];
                }
                // pull(transform: QueryLogTransform, since: Moment.Moment, until: Moment.Moment, group: string): QueryLogItem[]
                if (lodash_1.isFunction(args[0]) && Moment.isMoment(args[1]) && Moment.isMoment(args[2]) && lodash_1.isString(args[3])) {
                    result.transform = args[0];
                    result.since = args[1];
                    result.until = args[2];
                    result.group = args[3];
                }
                break;
            default:
                break;
        }
        // pull(): QueryLogItem[]
        return result;
    },
    pull() {
        if (!this.enabled) {
            return [];
        }
        const pullingPipe = this.circle;
        this.circle = pullingPipe === 'flip' ? 'flop' : 'flip';
        const args = this.parsePullArguments(arguments);
        const group = args['group'];
        const since = args['since'];
        const until = args['until'];
        const transform = args['transform'];
        const result = [];
        this[pullingPipe].forEach((item) => {
            let match = true;
            if (group) {
                match = item.group === group;
            }
            if (match && since) {
                match = item.when.isSameOrAfter(since);
            }
            if (match && until) {
                match = item.when.isSameOrBefore(until);
            }
            if (match) {
                result.push(transform ? transform(item) : item);
                return;
            }
            // put not matched item back to the other pipe
            this[this.circle].push(item);
        });
        this[pullingPipe] = [];
        return result.sort(function (a, b) {
            return a.when.toDate().getTime() - b.when.toDate().getTime();
        });
    }
};
exports.QueryLog = implementation;
