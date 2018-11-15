"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExecutorBase {
    constructor() {
        this.executeMode = 'default';
    }
    setExecuteMode(mode) {
        this.executeMode = mode;
        return this;
    }
    shouldExecute() {
        return this.executeMode !== 'disabled';
    }
}
exports.ExecutorBase = ExecutorBase;
