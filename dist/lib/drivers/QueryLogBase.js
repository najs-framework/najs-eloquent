"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const QueryLogFacade_1 = require("../facades/global/QueryLogFacade");
class QueryLogBase {
    constructor() {
        this.data = this.getDefaultData();
    }
    getEmptyData() {
        return {
            raw: '',
            queryBuilderData: {}
        };
    }
    queryBuilderData(key, value) {
        this.data.queryBuilderData[key] = value;
        return this;
    }
    name(name) {
        this.data.name = name;
        return this;
    }
    action(action) {
        this.data.action = action;
        return this;
    }
    raw(...args) {
        this.data.raw += lodash_1.flatten(args)
            .map(function (item) {
            if (typeof item === 'string') {
                return item;
            }
            return JSON.stringify(item);
        })
            .join('');
        return this;
    }
    end(result) {
        this.data.result = result;
        QueryLogFacade_1.QueryLog.push(this.data);
        return result;
    }
}
exports.QueryLogBase = QueryLogBase;
