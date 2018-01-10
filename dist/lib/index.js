"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentMongoose_1 = require("./eloquent/EloquentMongoose");
exports.Mongoose = EloquentMongoose_1.EloquentMongoose;
exports.Eloquent = {
    Mongoose() {
        return EloquentMongoose_1.EloquentMongoose;
    }
};
exports.default = exports.Eloquent;
var EloquentBase_1 = require("./eloquent/EloquentBase");
exports.EloquentBase = EloquentBase_1.EloquentBase;
//# sourceMappingURL=index.js.map