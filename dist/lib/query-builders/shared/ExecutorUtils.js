"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExecutorUtils {
    static addSoftDeleteConditionIfNeeded(handler) {
        if (handler.shouldAddSoftDeleteCondition()) {
            const settings = handler.getSoftDeletesSetting();
            handler.getConditionQuery().whereNull(settings.deletedAt);
            handler.markSoftDeleteState('added');
        }
    }
}
exports.ExecutorUtils = ExecutorUtils;
