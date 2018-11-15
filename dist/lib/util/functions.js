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
function find_base_prototypes(prototype, root) {
    const bases = [];
    let count = 0;
    do {
        prototype = Object.getPrototypeOf(prototype);
        bases.push(prototype);
        count++;
    } while (count < 100 && (typeof prototype === 'undefined' || prototype !== root));
    return bases;
}
exports.find_base_prototypes = find_base_prototypes;
function parse_string_with_dot_notation(input) {
    const parts = input.split('.').filter(item => item !== '');
    const result = { first: '', last: '', afterFirst: '', beforeLast: '', parts: parts };
    if (parts.length === 0) {
        return result;
    }
    if (parts.length === 1) {
        result.first = parts[0];
        result.last = parts[0];
        result.afterFirst = '';
        result.beforeLast = '';
    }
    else {
        result.first = parts[0];
        result.last = parts[parts.length - 1];
        result.afterFirst = parts.slice(1).join('.');
        result.beforeLast = parts.slice(0, parts.length - 1).join('.');
    }
    return result;
}
exports.parse_string_with_dot_notation = parse_string_with_dot_notation;
function override_setting_property_of_model(model, property, values) {
    if (typeof model['internalData']['overridden'] === 'undefined') {
        model['internalData']['overridden'] = {};
    }
    model['internalData']['overridden'][property] = true;
    model[property] = values;
}
exports.override_setting_property_of_model = override_setting_property_of_model;
