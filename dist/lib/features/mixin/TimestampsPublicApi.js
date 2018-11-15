"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampsPublicApi = {
    touch() {
        this.driver.getTimestampsFeature().touch(this);
        return this;
    }
};
