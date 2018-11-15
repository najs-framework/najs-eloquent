"use strict";
/// <reference path="../definitions/data/IDataReader.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Record_1 = require("./Record");
const helpers_1 = require("../util/helpers");
exports.RecordDataReader = {
    getAttribute(data, field) {
        return this.toComparable(data.getAttribute(field));
    },
    pick(record, selectedFields) {
        const data = record.toObject();
        return new Record_1.Record(lodash_1.pick(data, selectedFields));
    },
    toComparable(value) {
        return helpers_1.isObjectId(value) ? value.toHexString() : value;
    }
};
