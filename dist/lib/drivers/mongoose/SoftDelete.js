"use strict";
/// <reference path="../../model/interfaces/IModelSoftDeletes.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const lodash_1 = require("lodash");
const Moment = require("moment");
// tslint:disable-next-line
const NOT_DELETED_VALUE = null;
const DEFAULT_OPTIONS = { deletedAt: 'deleted_at', overrideMethods: false };
function SoftDelete(schema, options) {
    const opts = lodash_1.isObject(options)
        ? Object.assign({}, DEFAULT_OPTIONS, options)
        : DEFAULT_OPTIONS;
    schema.add({
        [opts.deletedAt]: { type: Date, default: NOT_DELETED_VALUE }
    });
    if (opts.overrideMethods) {
        apply_override_methods(schema, opts);
    }
    schema.methods.delete = function (...args) {
        this[opts.deletedAt] = Moment().toDate();
        return this.save(...args);
    };
    schema.methods.restore = function (callback) {
        this[opts.deletedAt] = NOT_DELETED_VALUE;
        return this.save(callback);
    };
}
exports.SoftDelete = SoftDelete;
function find_override_methods(opts) {
    const overridableMethods = ['count', 'find', 'findOne'];
    let finalList = [];
    if ((typeof opts.overrideMethods === 'string' || opts.overrideMethods instanceof String) &&
        opts.overrideMethods === 'all') {
        finalList = overridableMethods;
    }
    if (typeof opts.overrideMethods === 'boolean' && opts.overrideMethods === true) {
        finalList = overridableMethods;
    }
    if (Array.isArray(opts.overrideMethods)) {
        opts.overrideMethods.forEach(function (method) {
            if (overridableMethods.indexOf(method) !== -1) {
                finalList.push(method);
            }
        });
    }
    return finalList;
}
function apply_override_methods(schema, opts) {
    find_override_methods(opts).forEach(function (method) {
        schema.statics[method] = function () {
            return mongoose_1.Model[method]
                .apply(this, arguments)
                .where(opts.deletedAt)
                .equals(NOT_DELETED_VALUE);
        };
        schema.statics[method + 'OnlyDeleted'] = function () {
            return mongoose_1.Model[method]
                .apply(this, arguments)
                .where(opts.deletedAt)
                .ne(NOT_DELETED_VALUE);
        };
        schema.statics[method + 'WithDeleted'] = function () {
            return mongoose_1.Model[method].apply(this, arguments);
        };
    });
}
