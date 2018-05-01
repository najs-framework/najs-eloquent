"use strict";
/// <reference path="../../contracts/QueryLog.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../../query-log/FlipFlopQueryLog");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const container_1 = require("../container");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(container_1.container, 'QueryLog', function () {
    return najs_binding_1.make(constants_1.NajsEloquent.QueryLog.FlipFlopQueryLog);
});
exports.QueryLogFacade = facade;
exports.QueryLog = facade;
