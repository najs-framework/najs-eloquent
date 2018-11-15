"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftDeletesPublicApi = {
    trashed() {
        return this.driver.getSoftDeletesFeature().trashed(this);
    },
    forceDelete() {
        return this.driver.getSoftDeletesFeature().forceDelete(this);
    },
    restore() {
        return this.driver.getSoftDeletesFeature().restore(this);
    }
};
