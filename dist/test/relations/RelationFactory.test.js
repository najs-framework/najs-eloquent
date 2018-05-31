"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const RelationFactory_1 = require("../../lib/relations/RelationFactory");
const HasOneOrMany_1 = require("../../lib/relations/HasOneOrMany");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const Eloquent_1 = require("../../lib/model/Eloquent");
const najs_binding_1 = require("najs-binding");
const RelationType_1 = require("../../lib/relations/RelationType");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
class Test extends Eloquent_1.Eloquent {
}
Test.className = 'Test';
najs_binding_1.register(Test);
describe('RelationFactory', function () {
    describe('.setupRelation', function () {
        it('makes new instance by className and returns if the RelationFactory created with isSample = true', function () {
            const factory = new RelationFactory_1.RelationFactory({}, 'test', true);
            const setup = function () { };
            const setupSpy = Sinon.spy(setup);
            const makeStub = Sinon.stub(NajsBinding, 'make');
            factory.setupRelation('Test', setupSpy);
            expect(makeStub.calledWith('Test')).toBe(true);
            expect(setupSpy.called).toBe(false);
            makeStub.restore();
        });
        it('calls setup() and assign value to this.relation if isSample = false', function () {
            const factory = new RelationFactory_1.RelationFactory({}, 'test', false);
            const setup = function () {
                return 'anything';
            };
            const setupSpy = Sinon.spy(setup);
            factory.setupRelation('Test', setupSpy);
            expect(setupSpy.called).toBe(true);
            expect(factory['relation']).toEqual('anything');
        });
        it('return this.relation if the variable already set, never call setup() again', function () {
            const factory = new RelationFactory_1.RelationFactory({}, 'test', false);
            const setup = function () {
                return 'anything';
            };
            const setupSpy = Sinon.spy(setup);
            factory['relation'] = 'already created';
            factory.setupRelation('Test', setupSpy);
            expect(setupSpy.called).toBe(false);
        });
    });
    describe('.getModelByNameOrDefinition', function () {
        it('uses Reflect.construct() to create model if the input is a Function', function () {
            class InputDefinition {
            }
            const makeStub = Sinon.stub(NajsBinding, 'make');
            const factory = new RelationFactory_1.RelationFactory({}, 'test', true);
            expect(factory.getModelByNameOrDefinition(InputDefinition)).toBeInstanceOf(InputDefinition);
            expect(makeStub.called).toBe(false);
            makeStub.restore();
        });
        it('uses make() to create model if the input is a string', function () {
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns('anything');
            const factory = new RelationFactory_1.RelationFactory({}, 'test', true);
            expect(factory.getModelByNameOrDefinition('Test')).toEqual('anything');
            expect(makeStub.calledWith('Test')).toBe(true);
            makeStub.restore();
        });
    });
    describe('.setupHasOneOrMany()', function () {
        it('creates a HasOneOrMany instance and call HasOneOrMany.setup()', function () {
            const factory = new RelationFactory_1.RelationFactory({}, 'test', true);
            const local = {};
            const foreign = {};
            const instance = factory.setupHasOneOrMany(true, local, foreign, RelationType_1.RelationType.BelongsTo);
            expect(instance).toBeInstanceOf(HasOneOrMany_1.HasOneOrMany);
            expect(instance['is1v1']).toBe(true);
            expect(instance['local'] === local).toBe(true);
            expect(instance['foreign'] === foreign).toBe(true);
        });
    });
    describe('.hasOne()', function () {
        class ModelA extends Eloquent_1.Eloquent {
        }
        ModelA.className = 'ModelA';
        najs_binding_1.register(ModelA);
        it('calls .setupRelation() with class "NajsEloquent.Relation.HasOneOrMany" by default', function () {
            const factory = new RelationFactory_1.RelationFactory({}, 'test', true);
            const setupRelationStub = Sinon.stub(factory, 'setupRelation');
            factory.hasOne('Test');
            expect(setupRelationStub.calledWith('NajsEloquent.Relation.HasOneOrMany')).toBe(true);
        });
        it('creates an localInfo from rootModel, foreignInfo from model in the first param', function () {
            const factory = new RelationFactory_1.RelationFactory(new ModelA(), 'test', false);
            const setupHasOneOrManyStub = Sinon.stub(factory, 'setupHasOneOrMany');
            factory.hasOne('Test');
            expect(setupHasOneOrManyStub.calledWith(true, {
                model: 'ModelA',
                table: 'model_as',
                key: 'id'
            }, {
                model: 'Test',
                table: 'tests',
                key: 'model_a_id'
            })).toBe(true);
        });
        it('can created with custom foreign key in the second param and local key in third param', function () {
            const factory = new RelationFactory_1.RelationFactory(new ModelA(), 'test', false);
            const setupHasOneOrManyStub = Sinon.stub(factory, 'setupHasOneOrMany');
            factory.hasOne('Test', 'test_foreign_id');
            expect(setupHasOneOrManyStub.calledWith(true, {
                model: 'ModelA',
                table: 'model_as',
                key: 'id'
            }, {
                model: 'Test',
                table: 'tests',
                key: 'test_foreign_id'
            })).toBe(true);
            delete factory['relation'];
            factory.hasOne('Test', 'test_foreign_id', 'anything');
            expect(setupHasOneOrManyStub.calledWith(true, {
                model: 'ModelA',
                table: 'model_as',
                key: 'anything'
            }, {
                model: 'Test',
                table: 'tests',
                key: 'test_foreign_id'
            })).toBe(true);
        });
    });
    describe('.hasMany()', function () {
        class ModelA extends Eloquent_1.Eloquent {
        }
        ModelA.className = 'ModelA';
        najs_binding_1.register(ModelA);
        it('calls .setupRelation() with class "NajsEloquent.Relation.HasOneOrMany" by default', function () {
            const factory = new RelationFactory_1.RelationFactory({}, 'test', true);
            const setupRelationStub = Sinon.stub(factory, 'setupRelation');
            factory.hasMany('Test');
            expect(setupRelationStub.calledWith('NajsEloquent.Relation.HasOneOrMany')).toBe(true);
        });
        it('creates an localInfo from rootModel, foreignInfo from model in the first param', function () {
            const factory = new RelationFactory_1.RelationFactory(new ModelA(), 'test', false);
            const setupHasOneOrManyStub = Sinon.stub(factory, 'setupHasOneOrMany');
            factory.hasMany('Test');
            expect(setupHasOneOrManyStub.calledWith(false, {
                model: 'ModelA',
                table: 'model_as',
                key: 'id'
            }, {
                model: 'Test',
                table: 'tests',
                key: 'model_a_id'
            })).toBe(true);
        });
        it('can created with custom foreign key in the second param and local key in third param', function () {
            const factory = new RelationFactory_1.RelationFactory(new ModelA(), 'test', false);
            const setupHasOneOrManyStub = Sinon.stub(factory, 'setupHasOneOrMany');
            factory.hasMany('Test', 'test_foreign_id');
            expect(setupHasOneOrManyStub.calledWith(false, {
                model: 'ModelA',
                table: 'model_as',
                key: 'id'
            }, {
                model: 'Test',
                table: 'tests',
                key: 'test_foreign_id'
            })).toBe(true);
            delete factory['relation'];
            factory.hasMany('Test', 'test_foreign_id', 'anything');
            expect(setupHasOneOrManyStub.calledWith(false, {
                model: 'ModelA',
                table: 'model_as',
                key: 'anything'
            }, {
                model: 'Test',
                table: 'tests',
                key: 'test_foreign_id'
            })).toBe(true);
        });
    });
    describe('.belongsTo()', function () {
        class ModelB extends Eloquent_1.Eloquent {
        }
        ModelB.className = 'ModelB';
        najs_binding_1.register(ModelB);
        it('calls .setupRelation() with class "NajsEloquent.Relation.HasOneOrMany" by default', function () {
            const factory = new RelationFactory_1.RelationFactory({}, 'test', true);
            const setupRelationStub = Sinon.stub(factory, 'setupRelation');
            factory.belongsTo('Test');
            expect(setupRelationStub.calledWith('NajsEloquent.Relation.HasOneOrMany')).toBe(true);
        });
        it('creates an local from model in the first param, foreignInfo from rootModel', function () {
            const factory = new RelationFactory_1.RelationFactory(new ModelB(), 'test', false);
            const setupHasOneOrManyStub = Sinon.stub(factory, 'setupHasOneOrMany');
            factory.belongsTo('Test');
            expect(setupHasOneOrManyStub.calledWith(true, {
                model: 'Test',
                table: 'tests',
                key: 'id'
            }, {
                model: 'ModelB',
                table: 'model_bs',
                key: 'test_id'
            })).toBe(true);
        });
        it('can created with custom foreign key in the second param and local key in third param', function () {
            const factory = new RelationFactory_1.RelationFactory(new ModelB(), 'test', false);
            const setupHasOneOrManyStub = Sinon.stub(factory, 'setupHasOneOrMany');
            factory.belongsTo('Test', 'test_foreign_id');
            expect(setupHasOneOrManyStub.calledWith(true, {
                model: 'Test',
                table: 'tests',
                key: 'id'
            }, {
                model: 'ModelB',
                table: 'model_bs',
                key: 'test_foreign_id'
            })).toBe(true);
            delete factory['relation'];
            factory.belongsTo('Test', 'test_foreign_id', 'anything');
            expect(setupHasOneOrManyStub.calledWith(true, {
                model: 'Test',
                table: 'tests',
                key: 'anything'
            }, {
                model: 'ModelB',
                table: 'model_bs',
                key: 'test_foreign_id'
            })).toBe(true);
        });
    });
});
