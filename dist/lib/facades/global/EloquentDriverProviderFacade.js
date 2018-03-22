"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../providers/DriverManager");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const NajsEloquent_1 = require("../NajsEloquent");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(NajsEloquent_1.NajsEloquent, 'DriverManager', function () {
    return najs_binding_1.make(constants_1.NajsEloquentClass.DriverManager);
});
exports.EloquentDriverProviderFacade = facade;
exports.EloquentDriverProvider = facade;
