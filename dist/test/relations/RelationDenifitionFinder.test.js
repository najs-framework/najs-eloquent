"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const Model_1 = require("../../lib/model/Model");
const MemoryDriver_1 = require("../../lib/drivers/memory/MemoryDriver");
const DriverProviderFacade_1 = require("../../lib/facades/global/DriverProviderFacade");
const functions_1 = require("../../lib/util/functions");
const RelationDefinitionFinder_1 = require("../../lib/relations/RelationDefinitionFinder");
DriverProviderFacade_1.DriverProvider.register(MemoryDriver_1.MemoryDriver, 'memory', true);
describe('RelationDefinitionFinder', function () {
    it('can find definition which defined via function', function () {
        class DefinedViaFunction extends Model_1.Model {
            getClassName() {
                return 'DefinedViaFunction';
            }
            getTestRelation() {
                return this.defineRelation('test').hasOne('Target', 'target_id', 'id');
            }
            getAnotherRelation() {
                return this.defineRelation('another').hasOne('Target', 'target_id', 'id');
            }
            getSkipRelation() {
                return 'invalid';
            }
        }
        najs_binding_1.register(DefinedViaFunction);
        const model = new DefinedViaFunction();
        const prototype = DefinedViaFunction.prototype;
        const bases = functions_1.find_base_prototypes(prototype, Object.prototype);
        const finder = new RelationDefinitionFinder_1.RelationDefinitionFinder(model, prototype, bases);
        expect(finder.getDefinitions()).toEqual({
            test: {
                accessor: 'test',
                target: 'getTestRelation',
                targetType: 'function',
                targetClass: 'DefinedViaFunction'
            },
            another: {
                accessor: 'another',
                target: 'getAnotherRelation',
                targetType: 'function',
                targetClass: 'DefinedViaFunction'
            }
        });
    });
    it('can find definition which defined via getter', function () {
        class DefinedViaGetter extends Model_1.Model {
            get testRelation() {
                return this.defineRelation('test').hasOne('Target', 'target_id', 'id');
            }
            get anotherRelation() {
                return this.defineRelation('another').hasOne('Target', 'target_id', 'id');
            }
            get skipRelation() {
                return 'invalid';
            }
        }
        DefinedViaGetter.className = 'DefinedViaGetter';
        najs_binding_1.register(DefinedViaGetter);
        const model = new DefinedViaGetter();
        const prototype = DefinedViaGetter.prototype;
        const bases = functions_1.find_base_prototypes(prototype, Object.prototype);
        const finder = new RelationDefinitionFinder_1.RelationDefinitionFinder(model, prototype, bases);
        expect(finder.getDefinitions()).toEqual({
            test: {
                accessor: 'test',
                target: 'testRelation',
                targetType: 'getter'
            },
            another: {
                accessor: 'another',
                target: 'anotherRelation',
                targetType: 'getter'
            }
        });
    });
    it('can skip function/getter which throws error', function () {
        class SkipErrorDefinitions extends Model_1.Model {
            getTestErrorRelation() {
                throw new Error('any');
            }
            get anotherErrorRelation() {
                throw new Error('any');
            }
            get testRelation() {
                return this.defineRelation('test').hasOne('Target', 'target_id', 'id');
            }
        }
        SkipErrorDefinitions.className = 'SkipErrorDefinitions';
        najs_binding_1.register(SkipErrorDefinitions);
        const model = new SkipErrorDefinitions();
        const prototype = SkipErrorDefinitions.prototype;
        const bases = functions_1.find_base_prototypes(prototype, Object.prototype);
        const finder = new RelationDefinitionFinder_1.RelationDefinitionFinder(model, prototype, bases);
        expect(finder.getDefinitions()).toEqual({
            test: {
                accessor: 'test',
                target: 'testRelation',
                targetType: 'getter'
            }
        });
    });
    it('can find definition which defined in parent class', function () {
        class DefinedParent extends Model_1.Model {
            getTestRelation() {
                return this.defineRelation('test').hasOne('Target', 'target_id', 'id');
            }
        }
        class DefinedChild extends DefinedParent {
            get anotherRelation() {
                return this.defineRelation('another').hasOne('Target', 'target_id', 'id');
            }
            get skipRelation() {
                return 'invalid';
            }
        }
        DefinedChild.className = 'DefinedChild';
        najs_binding_1.register(DefinedChild);
        const model = new DefinedChild();
        const prototype = DefinedChild.prototype;
        const bases = functions_1.find_base_prototypes(prototype, Object.prototype);
        const finder = new RelationDefinitionFinder_1.RelationDefinitionFinder(model, prototype, bases);
        expect(finder.getDefinitions()).toEqual({
            test: {
                accessor: 'test',
                target: 'getTestRelation',
                targetType: 'function'
            },
            another: {
                accessor: 'another',
                target: 'anotherRelation',
                targetType: 'getter'
            }
        });
    });
    it('can warning if the relation function redefine under the same property', function () {
        class RedefinedProperty extends Model_1.Model {
            getTestRelation() {
                return this.defineRelation('test').hasOne('Target', 'target_id', 'id');
            }
            getAnotherRelation() {
                return this.defineRelation('test').hasOne('Target', 'target_id', 'id');
            }
        }
        RedefinedProperty.className = 'RedefinedProperty';
        najs_binding_1.register(RedefinedProperty);
        const model = new RedefinedProperty();
        const prototype = RedefinedProperty.prototype;
        const bases = functions_1.find_base_prototypes(prototype, Object.prototype);
        const finder = new RelationDefinitionFinder_1.RelationDefinitionFinder(model, prototype, bases);
        const warnStub = Sinon.stub(console, 'warn');
        const warningSpy = Sinon.spy(finder, 'warning');
        expect(finder.getDefinitions()).toEqual({
            test: {
                accessor: 'test',
                target: 'getTestRelation',
                targetType: 'function'
            }
        });
        expect(warningSpy.calledWith({
            target: 'getAnotherRelation',
            targetType: 'function',
            accessor: 'test',
            targetClass: undefined
        }, {
            target: 'getTestRelation',
            targetType: 'function',
            accessor: 'test',
            targetClass: undefined
        })).toBe(true);
        warnStub.restore();
        warningSpy.restore();
    });
    describe('.formatTargetName()', function () {
        it('returns formatted target name of the definition', function () {
            const dataset = [
                {
                    input: {
                        target: 'getTestRelation',
                        targetType: 'function',
                        accessor: 'test',
                        targetClass: 'Class'
                    },
                    output: '"Class.getTestRelation()"'
                },
                {
                    input: {
                        target: 'testRelation',
                        targetType: 'getter',
                        accessor: 'test',
                        targetClass: 'Class'
                    },
                    output: '"Class.testRelation"'
                },
                {
                    input: {
                        target: 'getTestRelation',
                        targetType: 'function',
                        accessor: 'test'
                    },
                    output: '"getTestRelation()"'
                },
                {
                    input: {
                        target: 'testRelation',
                        targetType: 'getter',
                        accessor: 'test'
                    },
                    output: '"testRelation"'
                }
            ];
            for (const data of dataset) {
                const model = {};
                const finder = new RelationDefinitionFinder_1.RelationDefinitionFinder(model, {}, []);
                expect(finder.formatTargetName(data.input)).toEqual(data.output);
            }
        });
    });
});
