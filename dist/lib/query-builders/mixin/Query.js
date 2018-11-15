"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = {
    select(...fields) {
        this.handler.getBasicQuery().select(...fields);
        this.handler.markUsed();
        return this;
    },
    limit(record) {
        this.handler.getBasicQuery().limit(record);
        this.handler.markUsed();
        return this;
    },
    orderBy(field, direction) {
        this.handler.getBasicQuery().orderBy(field, direction);
        this.handler.markUsed();
        return this;
    },
    queryName(name) {
        this.handler.setQueryName(name);
        this.handler.markUsed();
        return this;
    },
    setLogGroup(group) {
        this.handler.setLogGroup(group);
        this.handler.markUsed();
        return this;
    },
    orderByAsc(field) {
        return this.orderBy(field, 'asc');
    },
    orderByDesc(field) {
        return this.orderBy(field, 'desc');
    },
    withTrashed() {
        if (this.handler.hasSoftDeletes()) {
            this.handler.markSoftDeleteState('should-not-add');
            this.handler.markUsed();
        }
        return this;
    },
    onlyTrashed() {
        if (this.handler.hasSoftDeletes()) {
            this.handler.markSoftDeleteState('should-not-add');
            this.whereNotNull(this.handler.getSoftDeletesSetting().deletedAt);
            this.handler.markUsed();
        }
        return this;
    }
};
