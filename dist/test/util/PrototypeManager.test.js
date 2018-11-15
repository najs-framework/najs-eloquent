"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const PrototypeManager_1 = require("../../lib/util/PrototypeManager");
describe('PrototypeManager', function () {
    const a = {};
    const b = {};
    describe('.shouldFindRelationsIn()', function () {
        it('finds and returns false if the prototype is in "stopFindingRelationsPrototypes"', function () {
            PrototypeManager_1.PrototypeManager.stopFindingRelationsIn(a);
            expect(PrototypeManager_1.PrototypeManager.shouldFindRelationsIn(a)).toBe(false);
            expect(PrototypeManager_1.PrototypeManager.shouldFindRelationsIn(b)).toBe(true);
        });
    });
    describe('.stopFindingRelationsIn()', function () {
        it('adds to "stopFindingRelationsPrototypes" in case .shouldFindRelationsIn() returns true', function () {
            const length = PrototypeManager_1.PrototypeManager.stopFindingRelationsPrototypes.length;
            PrototypeManager_1.PrototypeManager.stopFindingRelationsIn(a);
            expect(PrototypeManager_1.PrototypeManager.stopFindingRelationsPrototypes.length).toEqual(length);
            expect(PrototypeManager_1.PrototypeManager.shouldFindRelationsIn(b)).toBe(true);
            PrototypeManager_1.PrototypeManager.stopFindingRelationsIn(b);
            expect(PrototypeManager_1.PrototypeManager.shouldFindRelationsIn(b)).toBe(false);
            expect(PrototypeManager_1.PrototypeManager.stopFindingRelationsPrototypes.length).toEqual(length + 1);
        });
    });
});
