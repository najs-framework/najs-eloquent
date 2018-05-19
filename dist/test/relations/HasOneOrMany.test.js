"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Relation_1 = require("../../lib/relations/Relation");
const HasOneOrMany_1 = require("../../lib/relations/HasOneOrMany");
describe('HasOneOrMany', function () {
    it('extends Relation, implements IAutoload with class name NajsEloquent.Relation.HasOneOrMany', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        expect(relation).toBeInstanceOf(Relation_1.Relation);
        expect(relation.getClassName()).toEqual('NajsEloquent.Relation.HasOneOrMany');
    });
    describe('.setup()', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        relation.setup(true, {}, {});
    });
    describe('.buildData()', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        relation.buildData();
    });
    describe('.lazyLoad()', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        relation.lazyLoad();
    });
    describe('.eagerLoad()', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        relation.eagerLoad();
    });
});
