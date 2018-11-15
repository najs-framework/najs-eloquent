"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrototypeManager = {
    stopFindingRelationsPrototypes: [Object.prototype],
    stopFindingRelationsIn(prototype) {
        if (this.shouldFindRelationsIn(prototype)) {
            this.stopFindingRelationsPrototypes.push(prototype);
        }
    },
    shouldFindRelationsIn(prototype) {
        for (const item of this.stopFindingRelationsPrototypes) {
            if (item === prototype) {
                return false;
            }
        }
        return true;
    }
};
