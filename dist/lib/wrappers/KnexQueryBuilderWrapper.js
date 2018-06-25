"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const QueryBuilderWrapper_1 = require("./QueryBuilderWrapper");
const constants_1 = require("../constants");
class KnexQueryBuilderWrapper extends QueryBuilderWrapper_1.QueryBuilderWrapper {
    getClassName() {
        return constants_1.NajsEloquent.Wrapper.KnexQueryBuilderWrapper;
    }
    /**
     * Create a mongoose native query
     * @param handler
     */
    native(handler) {
        ;
        this.queryBuilder.native(handler);
        return this;
    }
}
KnexQueryBuilderWrapper.className = constants_1.NajsEloquent.Wrapper.KnexQueryBuilderWrapper;
exports.KnexQueryBuilderWrapper = KnexQueryBuilderWrapper;
najs_binding_1.register(KnexQueryBuilderWrapper, constants_1.NajsEloquent.Wrapper.KnexQueryBuilderWrapper);
