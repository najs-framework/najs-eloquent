"use strict";
/// <reference types="najs-binding" />
Object.defineProperty(exports, "__esModule", { value: true });
const QueryLogFacade_1 = require("../facades/global/QueryLogFacade");
const constants_1 = require("../constants");
const najs_binding_1 = require("najs-binding");
class KnexQueryLog {
    constructor(data) {
        this.data = data || {};
    }
    getClassName() {
        return constants_1.NajsEloquent.QueryBuilder.KnexQueryLog;
    }
    name(name) {
        this.data['name'] = name;
        return this;
    }
    sql(sql) {
        this.data['sql'] = sql;
        return this;
    }
    end() {
        QueryLogFacade_1.QueryLog.push(this.data);
    }
    log(queryBuilder) {
        if (queryBuilder['name']) {
            this.name(queryBuilder['name']);
        }
        if (queryBuilder['knexQueryBuilder']) {
            this.sql(queryBuilder['knexQueryBuilder'].toQuery()).end();
        }
    }
}
exports.KnexQueryLog = KnexQueryLog;
najs_binding_1.register(KnexQueryLog, constants_1.NajsEloquent.QueryBuilder.KnexQueryLog);
