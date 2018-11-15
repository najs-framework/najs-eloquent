"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class DataCollector {
    constructor(dataBuffer, reader) {
        this.dataBuffer = dataBuffer;
        this.reader = reader;
    }
    limit(value) {
        this.limited = value;
        return this;
    }
    select(selectedFields) {
        this.selected = selectedFields;
        return this;
    }
    orderBy(directions) {
        this.sortedBy = directions;
        return this;
    }
    filterBy(conditions) {
        this.conditions = conditions;
        return this;
    }
    isMatch(item, conditions) {
        if (typeof conditions['$or'] !== 'undefined') {
            return this.isMatchAtLeastOneCondition(item, conditions['$or']);
        }
        if (typeof conditions['$and'] !== 'undefined') {
            return this.isMatchAllConditions(item, conditions['$and']);
        }
        return false;
    }
    isMatchAtLeastOneCondition(item, conditions) {
        for (const matcherOrSubConditions of conditions) {
            if (typeof matcherOrSubConditions['isMatch'] === 'function') {
                if (matcherOrSubConditions.isMatch(item)) {
                    return true;
                }
                continue;
            }
            if (this.isMatch(item, matcherOrSubConditions)) {
                return true;
            }
        }
        return false;
    }
    isMatchAllConditions(item, conditions) {
        for (const matcherOrSubConditions of conditions) {
            if (typeof matcherOrSubConditions['isMatch'] === 'function') {
                if (!matcherOrSubConditions.isMatch(item)) {
                    return false;
                }
                continue;
            }
            if (!this.isMatch(item, matcherOrSubConditions)) {
                return false;
            }
        }
        return true;
    }
    hasFilterByConfig() {
        return typeof this.conditions !== 'undefined';
    }
    hasOrderByConfig() {
        return typeof this.sortedBy !== 'undefined' && this.sortedBy.length > 0;
    }
    hasSelectedFieldsConfig() {
        return typeof this.selected !== 'undefined' && this.selected.length > 0;
    }
    exec() {
        const filtered = [];
        const shouldMatchItem = this.hasFilterByConfig();
        const shouldSortResult = this.hasOrderByConfig();
        const shouldPickFields = this.hasSelectedFieldsConfig();
        for (const item of this.dataBuffer) {
            if (shouldMatchItem && !this.isMatch(item, this.conditions)) {
                continue;
            }
            // Edge cases which happens if there is no sortedBy data
            if (!shouldSortResult) {
                filtered.push(shouldPickFields ? this.reader.pick(item, this.selected) : item);
                // Edge case #1: the result is reach limited number the process should be stopped
                if (this.limited && filtered.length === this.limited) {
                    return filtered;
                }
                continue;
            }
            // if there is a sorted data, always push the raw record
            filtered.push(item);
        }
        return shouldSortResult ? this.sortLimitAndSelectItems(filtered) : filtered;
    }
    sortLimitAndSelectItems(items) {
        let result = items.sort((a, b) => this.compare(a, b, 0));
        if (this.limited) {
            result = result.slice(0, this.limited);
        }
        if (this.hasSelectedFieldsConfig()) {
            return result.map(item => this.reader.pick(item, this.selected));
        }
        return result;
    }
    compare(a, b, index) {
        const key = this.sortedBy[index][0];
        const valueA = this.reader.getAttribute(a, key);
        const valueB = this.reader.getAttribute(b, key);
        const result = lodash_1.eq(valueA, valueB);
        if (result) {
            if (index + 1 >= this.sortedBy.length) {
                return 0;
            }
            return this.compare(a, b, index + 1);
        }
        const direction = this.sortedBy[index][1];
        const isLessThan = lodash_1.lt(valueA, valueB);
        if (isLessThan) {
            return direction === 'asc' ? -1 : 1;
        }
        return direction === 'asc' ? 1 : -1;
    }
}
exports.DataCollector = DataCollector;
