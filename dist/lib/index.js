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
//# sourceMappingURL=index.js.map