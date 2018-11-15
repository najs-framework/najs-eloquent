"use strict";
/// <reference path="../contracts/MomentProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../constants");
const moment = require('moment');
class MomentProvider extends najs_facade_1.Facade {
    getClassName() {
        return constants_1.NajsEloquent.Provider.MomentProvider;
    }
    make() {
        return moment(...arguments);
    }
    isMoment(value) {
        return moment.isMoment(value);
    }
    setNow(cb) {
        moment.now = cb;
        return this;
    }
}
exports.MomentProvider = MomentProvider;
najs_binding_1.register(MomentProvider, constants_1.NajsEloquent.Provider.MomentProvider);
