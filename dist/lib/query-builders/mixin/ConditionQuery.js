"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionQuery = {
    where(arg0, arg1, arg2) {
        const conditionQuery = this.handler.getConditionQuery();
        conditionQuery.where.apply(conditionQuery, arguments);
        this.handler.markUsed();
        return this;
    },
    orWhere(arg0, arg1, arg2) {
        const conditionQuery = this.handler.getConditionQuery();
        conditionQuery.orWhere.apply(conditionQuery, arguments);
        this.handler.markUsed();
        return this;
    },
    andWhere(arg0, arg1, arg2) {
        const conditionQuery = this.handler.getConditionQuery();
        conditionQuery.andWhere.apply(conditionQuery, arguments);
        this.handler.markUsed();
        return this;
    },
    whereNot(field, value) {
        this.handler.getConditionQuery().whereNot(field, value);
        this.handler.markUsed();
        return this;
    },
    andWhereNot(field, value) {
        this.handler.getConditionQuery().andWhereNot(field, value);
        this.handler.markUsed();
        return this;
    },
    orWhereNot(field, value) {
        this.handler.getConditionQuery().orWhereNot(field, value);
        this.handler.markUsed();
        return this;
    },
    whereIn(field, values) {
        this.handler.getConditionQuery().whereIn(field, values);
        this.handler.markUsed();
        return this;
    },
    andWhereIn(field, values) {
        this.handler.getConditionQuery().andWhereIn(field, values);
        this.handler.markUsed();
        return this;
    },
    orWhereIn(field, values) {
        this.handler.getConditionQuery().orWhereIn(field, values);
        this.handler.markUsed();
        return this;
    },
    whereNotIn(field, values) {
        this.handler.getConditionQuery().whereNotIn(field, values);
        this.handler.markUsed();
        return this;
    },
    andWhereNotIn(field, values) {
        this.handler.getConditionQuery().andWhereNotIn(field, values);
        this.handler.markUsed();
        return this;
    },
    orWhereNotIn(field, values) {
        this.handler.getConditionQuery().orWhereNotIn(field, values);
        this.handler.markUsed();
        return this;
    },
    whereNull(field) {
        this.handler.getConditionQuery().whereNull(field);
        this.handler.markUsed();
        return this;
    },
    andWhereNull(field) {
        this.handler.getConditionQuery().andWhereNull(field);
        this.handler.markUsed();
        return this;
    },
    orWhereNull(field) {
        this.handler.getConditionQuery().orWhereNull(field);
        this.handler.markUsed();
        return this;
    },
    whereNotNull(field) {
        this.handler.getConditionQuery().whereNotNull(field);
        this.handler.markUsed();
        return this;
    },
    andWhereNotNull(field) {
        this.handler.getConditionQuery().andWhereNotNull(field);
        this.handler.markUsed();
        return this;
    },
    orWhereNotNull(field) {
        this.handler.getConditionQuery().orWhereNotNull(field);
        this.handler.markUsed();
        return this;
    },
    whereBetween(field, range) {
        this.handler.getConditionQuery().whereBetween(field, range);
        this.handler.markUsed();
        return this;
    },
    andWhereBetween(field, range) {
        this.handler.getConditionQuery().andWhereBetween(field, range);
        this.handler.markUsed();
        return this;
    },
    orWhereBetween(field, range) {
        this.handler.getConditionQuery().orWhereBetween(field, range);
        this.handler.markUsed();
        return this;
    },
    whereNotBetween(field, range) {
        this.handler.getConditionQuery().whereNotBetween(field, range);
        this.handler.markUsed();
        return this;
    },
    andWhereNotBetween(field, range) {
        this.handler.getConditionQuery().andWhereNotBetween(field, range);
        this.handler.markUsed();
        return this;
    },
    orWhereNotBetween(field, range) {
        this.handler.getConditionQuery().orWhereNotBetween(field, range);
        this.handler.markUsed();
        return this;
    }
};
