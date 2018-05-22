"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../model/Model");
const collect_js_1 = require("collect.js");
const collection = collect_js_1.default([]);
const Collection = Object.getPrototypeOf(collection).constructor;
function isModel(value) {
    return value instanceof Model_1.Model;
}
exports.isModel = isModel;
function isCollection(value) {
    return value instanceof Collection;
}
exports.isCollection = isCollection;
