"use strict";
/// <reference path="../definitions/collect.js/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const collect = require('collect.js');
function make_collection(data, converter) {
    if (typeof converter === 'undefined') {
        return collect(data);
    }
    return collect(data.map(converter));
}
exports.make_collection = make_collection;
