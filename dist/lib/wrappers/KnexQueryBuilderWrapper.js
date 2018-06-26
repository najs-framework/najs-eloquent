"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const QueryBuilderWrapper_1 = require("./QueryBuilderWrapper");
const constants_1 = require("../constants");
class KnexQueryBuilderWrapper extends QueryBuilderWrapper_1.QueryBuilderWrapper {
    getClassName() {
        return constants_1.NajsEloquent.Wrapper.KnexQueryBuilderWrapper;
    }
    native(handler) {
        this.getKnexQueryBuilder().native(handler);
        return this;
    }
    getKnexQueryBuilder() {
        return this.queryBuilder;
    }
}
KnexQueryBuilderWrapper.className = constants_1.NajsEloquent.Wrapper.KnexQueryBuilderWrapper;
exports.KnexQueryBuilderWrapper = KnexQueryBuilderWrapper;
najs_binding_1.register(KnexQueryBuilderWrapper, constants_1.NajsEloquent.Wrapper.KnexQueryBuilderWrapper);
