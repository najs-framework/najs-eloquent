"use strict";
/// <reference path="../contracts/QueryLog.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../constants");
const lodash_1 = require("lodash");
const MomentProviderFacade_1 = require("../facades/global/MomentProviderFacade");
class FlipFlopQueryLog extends najs_facade_1.Facade {
    constructor() {
        super();
        this.flip = [];
        this.flop = [];
        this.circle = 'flip';
        this.enabled = false;
    }
    getClassName() {
        return constants_1.NajsEloquent.QueryLog.FlipFlopQueryLog;
    }
    assign_if_last_argument_is(type, args) {
        return typeof args[args.length - 1] === type ? args[args.length - 1] : undefined;
    }
    parse_pull_arguments_starts_with_string(args) {
        return {
            group: args[0],
            since: args[1] && MomentProviderFacade_1.MomentProvider.isMoment(args[1]) ? args[1] : undefined,
            until: args[2] && MomentProviderFacade_1.MomentProvider.isMoment(args[2]) ? args[2] : undefined,
            transform: this.assign_if_last_argument_is('function', args)
        };
    }
    parse_pull_arguments_starts_with_moment(args) {
        return {
            since: args[0],
            until: args[1] && MomentProviderFacade_1.MomentProvider.isMoment(args[1]) ? args[1] : undefined,
            group: this.assign_if_last_argument_is('string', args),
            transform: args[1] && lodash_1.isFunction(args[1]) ? args[1] : args[2] && lodash_1.isFunction(args[2]) ? args[2] : undefined
        };
    }
    parse_pull_arguments_starts_with_function(args) {
        return {
            transform: args[0],
            group: this.assign_if_last_argument_is('string', args),
            since: args[1] && MomentProviderFacade_1.MomentProvider.isMoment(args[1]) ? args[1] : undefined,
            until: args[2] && MomentProviderFacade_1.MomentProvider.isMoment(args[2]) ? args[2] : undefined
        };
    }
    isEnabled() {
        return this.enabled;
    }
    enable() {
        this.enabled = true;
        return this;
    }
    disable() {
        this.enabled = false;
        return this;
    }
    clear() {
        this.flip = [];
        this.flop = [];
        this.circle = 'flip';
        return this;
    }
    push(data, group = 'all') {
        if (!this.enabled) {
            return this;
        }
        this[this.circle].push({
            data: data,
            when: MomentProviderFacade_1.MomentProvider.make(),
            group: group
        });
        return this;
    }
    parsePullArguments(args) {
        if (lodash_1.isString(args[0])) {
            return this.parse_pull_arguments_starts_with_string(args);
        }
        if (MomentProviderFacade_1.MomentProvider.isMoment(args[0])) {
            return this.parse_pull_arguments_starts_with_moment(args);
        }
        if (lodash_1.isFunction(args[0])) {
            return this.parse_pull_arguments_starts_with_function(args);
        }
        return {};
    }
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
        return result.sort(FlipFlopQueryLog.sortByWhenAsc);
    }
    static sortByWhenAsc(a, b) {
        return a.when.toDate().getTime() - b.when.toDate().getTime();
    }
}
FlipFlopQueryLog.className = constants_1.NajsEloquent.QueryLog.FlipFlopQueryLog;
exports.FlipFlopQueryLog = FlipFlopQueryLog;
najs_binding_1.register(FlipFlopQueryLog, constants_1.NajsEloquent.QueryLog.FlipFlopQueryLog);
