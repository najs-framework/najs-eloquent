"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilderBase {
    constructor(primaryKeyName) {
        this.primaryKeyName = primaryKeyName || 'id';
        this.isUsed = false;
        this.convention = this.getQueryConvention();
    }
    getQueryConvention() {
        return QueryBuilderBase.DefaultConvention;
    }
    queryName(name) {
        this.name = name;
        return this;
    }
    setLogGroup(group) {
        this.logGroup = group;
        return this;
    }
    getPrimaryKeyName() {
        return this.convention.formatFieldName(this.primaryKeyName);
    }
    orderByAsc(field) {
        return this.orderBy(field, 'asc');
    }
    orderByDesc(field) {
        return this.orderBy(field, 'desc');
    }
}
QueryBuilderBase.DefaultConvention = {
    formatFieldName(name) {
        return name;
    },
    getNullValueFor(name) {
        // tslint:disable-next-line
        return null;
    }
};
exports.QueryBuilderBase = QueryBuilderBase;
