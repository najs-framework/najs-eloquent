"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryLog_1 = require("../../log/QueryLog");
const MongooseQueryBuilder_1 = require("./MongooseQueryBuilder");
const lodash_1 = require("lodash");
class MongooseQueryLog {
    constructor(data) {
        this.data = data;
        this.data['raw'] = '';
    }
    action(action) {
        this.data['action'] = action;
        return this;
    }
    raw(...args) {
        this.data['raw'] += lodash_1.flatten(args)
            .map(function (item) {
            if (typeof item === 'string') {
                return item;
            }
            return JSON.stringify(item);
        })
            .join('');
        return this;
    }
    end() {
        QueryLog_1.QueryLog.push(this.data);
    }
    static create(queryBuilder) {
        const log = new MongooseQueryLog(queryBuilder.toObject());
        log.data['builder'] = MongooseQueryBuilder_1.MongooseQueryBuilder.className;
        return log;
    }
}
exports.MongooseQueryLog = MongooseQueryLog;
