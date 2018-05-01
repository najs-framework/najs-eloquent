"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryLogFacade_1 = require("../../facades/global/QueryLogFacade");
const constants_1 = require("../../constants");
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
class MongooseQueryLog {
    constructor(data) {
        this.data = data;
        this.data['raw'] = '';
    }
    getClassName() {
        return constants_1.NajsEloquent.QueryBuilder.MongooseQueryLog;
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
        QueryLogFacade_1.QueryLog.push(this.data);
    }
}
MongooseQueryLog.className = constants_1.NajsEloquent.QueryBuilder.MongooseQueryLog;
exports.MongooseQueryLog = MongooseQueryLog;
najs_binding_1.register(MongooseQueryLog);
