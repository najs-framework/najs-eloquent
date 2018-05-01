"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * Check the given key is in the array or not
 *
 * @param {mixed} key
 * @param {mixed[]} args
 */
function in_array(key, ...args) {
    for (const array of args) {
        if (array.indexOf(key) !== -1) {
            return true;
        }
    }
    return false;
}
exports.in_array = in_array;
/**
 * Return new array which filter duplicated item in given array.
 *
 * @param {mixed[]} array
 */
function array_unique(...array) {
    return Array.from(new Set(lodash_1.flatten(array)));
}
exports.array_unique = array_unique;
