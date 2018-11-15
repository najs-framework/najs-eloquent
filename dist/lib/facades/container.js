"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
class NajsEloquentBag extends najs_facade_1.FacadeContainer {
}
exports.container = new NajsEloquentBag();
global['NajsEloquent'] = exports.container;
