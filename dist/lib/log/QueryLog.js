"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = require("moment");
const lodash_1 = require("lodash");
function assign_if_last_argument_is(type, args) {
    return typeof args[args.length - 1] === type ? args[args.length - 1] : undefined;
}
function parse_pull_arguments_starts_with_string(args) {
    return {
        group: args[0],
        since: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
        until: args[2] && Moment.isMoment(args[2]) ? args[2] : undefined,
        transform: assign_if_last_argument_is('function', args)
    };
}
function parse_pull_arguments_starts_with_moment(args) {
    return {
        since: args[0],
        until: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
        group: assign_if_last_argument_is('string', args),
        transform: args[1] && lodash_1.isFunction(args[1]) ? args[1] : args[2] && lodash_1.isFunction(args[2]) ? args[2] : undefined
    };
}
function parse_pull_arguments_starts_with_function(args) {
    return {
        transform: args[0],
        group: assign_if_last_argument_is('string', args),
        since: args[1] && Moment.isMoment(args[1]) ? args[1] : undefined,
        until: args[2] && Moment.isMoment(args[2]) ? args[2] : undefined
    };
}
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
        if (lodash_1.isString(args[0])) {
            return parse_pull_arguments_starts_with_string(args);
        }
        if (Moment.isMoment(args[0])) {
            return parse_pull_arguments_starts_with_moment(args);
        }
        if (lodash_1.isFunction(args[0])) {
            return parse_pull_arguments_starts_with_function(args);
        }
        return {};
    },
    pull() {
        if (!this.enabled) {
            return [];
        }
        const pullingPipe = this.circle;
        this.circle = pullingPipe === 'flip' ? 'flop' : 'flip';
        const args = this.parsePullArguments(arguments);
        const result = [];
        this[pullingPipe].forEach((item) => {
            let match = true;
            if (args['group']) {
                match = item.group === args['group'];
            }
            if (match && args['since']) {
                match = item.when.isSameOrAfter(args['since']);
            }
            if (match && args['until']) {
                match = item.when.isSameOrBefore(args['until']);
            }
            if (match) {
                result.push(args['transform'] ? args['transform'](item) : item);
                return;
            }
            this[this.circle].push(item); // put not matched item back to the other pipe
        });
        this[pullingPipe] = [];
        return result.sort(function (a, b) {
            return a.when.toDate().getTime() - b.when.toDate().getTime();
        });
    }
};
exports.QueryLog = implementation;
