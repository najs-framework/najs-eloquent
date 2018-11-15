"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const RecordManager_1 = require("../../lib/drivers/RecordManager");
const RecordManagerPublicApi_1 = require("../../lib/features/mixin/RecordManagerPublicApi");
describe('RecordManagerBase', function () {
    const executorFactory = {
        makeRecordExecutor(model, record) { }
    };
    const recordManager = new RecordManager_1.RecordManager(executorFactory);
    describe('constructor()', function () {
        it('needs executorFactory to initialize', function () {
            expect(recordManager['executorFactory'] === executorFactory).toBe(true);
        });
    });
    describe('.getRecordExecutor()', function () {
        it('calls and returns this.executorFactory.makeRecordExecutor() with model and model.attribute', function () {
            const recordExecutor = {
                setExecuteMode() { }
            };
            const stub = Sinon.stub(executorFactory, 'makeRecordExecutor');
            stub.returns(recordExecutor);
            const attributes = {};
            const model = {
                driver: {
                    getSettingFeature() {
                        return {
                            getSettingProperty() {
                                return 'default';
                            }
                        };
                    }
                },
                attributes: attributes
            };
            const spy = Sinon.spy(recordExecutor, 'setExecuteMode');
            expect(recordManager.getRecordExecutor(model)).toEqual(recordExecutor);
            expect(stub.calledWith(model, attributes)).toBe(true);
            expect(spy.calledWith('disabled')).toBe(false);
            stub.restore();
        });
        it('calls this.executorFactory.makeRecordExecutor() and calls .setExecuteMode() if there is a setting property "executeMode"', function () {
            const recordExecutor = {
                setExecuteMode() { }
            };
            const stub = Sinon.stub(executorFactory, 'makeRecordExecutor');
            stub.returns(recordExecutor);
            const attributes = {};
            const model = {
                driver: {
                    getSettingFeature() {
                        return {
                            getSettingProperty() {
                                return 'disabled';
                            }
                        };
                    }
                },
                attributes: attributes
            };
            const spy = Sinon.spy(recordExecutor, 'setExecuteMode');
            expect(recordManager.getRecordExecutor(model)).toEqual(recordExecutor);
            expect(stub.calledWith(model, attributes)).toBe(true);
            expect(spy.calledWith('disabled')).toBe(true);
            stub.restore();
        });
    });
    describe('.getFeatureName()', function () {
        it('returns literally string "RecordManager"', function () {
            expect(recordManager.getFeatureName()).toEqual('RecordManager');
        });
    });
    describe('.getRecordName()', function () {
        it('returns plural of getModelName() snake case', function () {
            const dataList = {
                Company: 'companies',
                Employee: 'employees',
                ProductOrder: 'product_orders'
            };
            for (const name in dataList) {
                const model = {
                    getModelName() {
                        return name;
                    }
                };
                expect(recordManager.getRecordName(model)).toEqual(dataList[name]);
            }
        });
    });
    describe('.getRecord()', function () {
        it('simply returns the attributes property of model', function () {
            const attributes = {};
            const model = { attributes };
            expect(recordManager.getRecord(model) === attributes).toBe(true);
        });
    });
    describe('.formatAttributeName()', function () {
        it('formats the attribute to snake case by default', function () {
            const model = {};
            const dataList = {
                companyId: 'company_id',
                productId: 'product_id',
                ProductOrderId: 'product_order_id'
            };
            for (const name in dataList) {
                expect(recordManager.formatAttributeName(model, name)).toEqual(dataList[name]);
            }
        });
    });
    describe('.getPrimaryKey()', function () {
        it('calls .getAttribute() with property from .getPrimaryKeyName()', function () {
            const getPrimaryKeyNameStub = Sinon.stub(recordManager, 'getPrimaryKeyName');
            getPrimaryKeyNameStub.returns('anything');
            const getAttributeStub = Sinon.stub(recordManager, 'getAttribute');
            getAttributeStub.returns('result');
            const model = {};
            expect(recordManager.getPrimaryKey(model)).toEqual('result');
            expect(getPrimaryKeyNameStub.calledWith(model)).toBe(true);
            expect(getAttributeStub.calledWith(model, 'anything')).toBe(true);
            getPrimaryKeyNameStub.restore();
            getAttributeStub.restore();
        });
    });
    describe('.setPrimaryKey()', function () {
        it('calls .setAttribute() with property from .getPrimaryKeyName()', function () {
            const getPrimaryKeyNameStub = Sinon.stub(recordManager, 'getPrimaryKeyName');
            getPrimaryKeyNameStub.returns('anything');
            const setAttributeStub = Sinon.stub(recordManager, 'setAttribute');
            setAttributeStub.returns('result');
            const model = {};
            expect(recordManager.setPrimaryKey(model, 'test')).toEqual('result');
            expect(getPrimaryKeyNameStub.calledWith(model)).toBe(true);
            expect(setAttributeStub.calledWith(model, 'anything', 'test')).toBe(true);
            getPrimaryKeyNameStub.restore();
            setAttributeStub.restore();
        });
    });
    describe('.getKnownAttributes()', function () {
        it('simply returns the property "knownAttributes" in "model.sharedMetadata"', function () {
            const knownAttributes = {};
            const model = {
                sharedMetadata: { knownAttributes }
            };
            expect(recordManager.getKnownAttributes(model) === knownAttributes).toBe(true);
        });
    });
    describe('.getDynamicAttributes()', function () {
        it('simply returns the property "dynamicAttributes" in "model.sharedMetadata"', function () {
            const dynamicAttributes = {};
            const model = {
                sharedMetadata: { dynamicAttributes }
            };
            expect(recordManager.getDynamicAttributes(model) === dynamicAttributes).toBe(true);
        });
    });
    describe('KnownAttributes', function () {
        describe('.buildKnownAttributes()', function () {
            it('gets all defined functions, attributes, getters, setters from prototype and bases, included some reserve attributes', function () {
                const prototype = {
                    getSomething() { }
                };
                const bases = [
                    { a: 1 },
                    {
                        get test() {
                            return 'any';
                        },
                        set attribute(value) { }
                    }
                ];
                const attributes = recordManager.buildKnownAttributes(prototype, bases);
                expect(attributes).toEqual([
                    // reserved attributes
                    '__sample',
                    'sharedMetadata',
                    'internalData',
                    'attributes',
                    'driver',
                    'primaryKey',
                    'executeMode',
                    'fillable',
                    'guarded',
                    'visible',
                    'hidden',
                    'schema',
                    'options',
                    'timestamps',
                    'softDeletes',
                    'pivot',
                    // functions, attributes, getters, setters from prototype
                    'getSomething',
                    'a',
                    'test',
                    'attribute'
                ]);
            });
        });
    });
    describe('KnownAttributes', function () {
        describe('.attachPublicApi()', function () {
            it('attaches RecordManagerPublicApi to prototype', function () {
                const prototype = { sharedMetadata: {} };
                recordManager.attachPublicApi(prototype, [], {});
                for (const name in RecordManagerPublicApi_1.RecordManagerPublicApi) {
                    expect(prototype[name] === RecordManagerPublicApi_1.RecordManagerPublicApi[name]);
                }
            });
            it('finds knownAttribute by .buildKnownAttributes(), dynamicAttributes by .buildDynamicAttributes() then define all of them to "sharedMetadata" and calls .bindAccessorsAndMutators()', function () {
                const prototype = { sharedMetadata: {} };
                const buildKnownAttributesStub = Sinon.stub(recordManager, 'buildKnownAttributes');
                buildKnownAttributesStub.returns('known');
                const buildDynamicAttributesStub = Sinon.stub(recordManager, 'buildDynamicAttributes');
                buildDynamicAttributesStub.returns('dynamic');
                const bindAccessorsAndMutatorsSpy = Sinon.stub(recordManager, 'bindAccessorsAndMutators');
                recordManager.attachPublicApi(prototype, [], {});
                expect(prototype['sharedMetadata']['knownAttributes']).toEqual('known');
                expect(prototype['sharedMetadata']['dynamicAttributes']).toEqual('dynamic');
                expect(bindAccessorsAndMutatorsSpy.calledOnce).toBe(true);
                buildKnownAttributesStub.restore();
                buildDynamicAttributesStub.restore();
                bindAccessorsAndMutatorsSpy.restore();
            });
        });
        describe('.buildDynamicAttributes()', function () {
            it('calls .findGettersAndSetters() and .findAccessorsAndMutators() for prototype and all bases and put in the same bucket', function () {
                class Base {
                    get first_name() {
                        return 'any';
                    }
                }
                class Test extends Base {
                    constructor() {
                        super(...arguments);
                        this.property = 'test';
                    }
                    getFirstNameAttribute() { }
                    get full_name() {
                        return 'any';
                    }
                    set full_name(value) { }
                }
                const baseOne = {
                    set lastName(value) { },
                    setLastNameAttribute() { },
                    getFullNameAttribute() { }
                };
                const baseTwo = {
                    setFullNameAttribute() { },
                    getSomething() { },
                    setSomething() { }
                };
                const bucket = recordManager.buildDynamicAttributes(Test.prototype, [
                    baseOne,
                    baseTwo,
                    Base.prototype,
                    Object.prototype
                ]);
                expect(bucket).toEqual({
                    first_name: { name: 'first_name', getter: true, setter: false, accessor: 'getFirstNameAttribute' },
                    last_name: { name: 'last_name', getter: false, setter: false, mutator: 'setLastNameAttribute' },
                    lastName: { name: 'lastName', getter: false, setter: true },
                    full_name: {
                        name: 'full_name',
                        getter: true,
                        setter: true,
                        accessor: 'getFullNameAttribute',
                        mutator: 'setFullNameAttribute'
                    }
                });
            });
        });
        describe('.findGettersAndSetters()', function () {
            it('finds all getter/setter in prototype without reformat the name', function () {
                const prototype = {
                    property: 'test',
                    get firstName() {
                        return 'any';
                    },
                    set lastName(value) { },
                    get fullName() {
                        return 'any';
                    },
                    set fullName(value) { }
                };
                const bucket = {};
                recordManager.findGettersAndSetters(bucket, prototype);
                expect(bucket).toEqual({
                    firstName: { name: 'firstName', getter: true, setter: false },
                    lastName: { name: 'lastName', getter: false, setter: true },
                    fullName: {
                        name: 'fullName',
                        getter: true,
                        setter: true
                    }
                });
            });
        });
        describe('.findAccessorsAndMutators()', function () {
            it('finds accessor/mutator if there is a function with name in format "get|set[Name]Attribute"', function () {
                const prototype = {
                    getFirstNameAttribute() { },
                    setLastNameAttribute() { },
                    getFullNameAttribute() { },
                    setFullNameAttribute() { },
                    getSomething() { },
                    setSomething() { }
                };
                const bucket = {};
                recordManager.findAccessorsAndMutators(bucket, prototype);
                expect(bucket).toEqual({
                    first_name: { name: 'first_name', getter: false, setter: false, accessor: 'getFirstNameAttribute' },
                    last_name: { name: 'last_name', getter: false, setter: false, mutator: 'setLastNameAttribute' },
                    full_name: {
                        name: 'full_name',
                        getter: false,
                        setter: false,
                        accessor: 'getFullNameAttribute',
                        mutator: 'setFullNameAttribute'
                    }
                });
            });
        });
        describe('.createDynamicAttributeIfNeeded()', function () {
            it('does nothing if the property is in bucket, otherwise will create an default setting', function () {
                const bucket = { a: 'anything' };
                recordManager.createDynamicAttributeIfNeeded(bucket, 'a');
                recordManager.createDynamicAttributeIfNeeded(bucket, 'b');
                expect(bucket).toEqual({ a: 'anything', b: { name: 'b', getter: false, setter: false } });
            });
        });
        describe('.bindAccessorsAndMutators()', function () {
            it('calls .makeAccessorAndMutatorDescriptor() to get descriptor, if result is not undefined it defines the descriptor to prototype', function () {
                const settings = {
                    a: { name: 'a', getter: true, setter: true },
                    property: { name: 'property', getter: false, setter: false, accessor: 'getPropertyAttribute' }
                };
                class Test {
                    getPropertyAttribute() {
                        return 'test';
                    }
                }
                recordManager.bindAccessorsAndMutators(Test.prototype, settings);
                const instance = new Test();
                instance['sharedMetadata'] = { dynamicAttributes: settings };
                expect(instance.property).toEqual('test');
            });
        });
        describe('.makeAccessorAndMutatorDescriptor()', function () {
            it('returns undefined if the settings has getter and setter', function () {
                expect(recordManager.makeAccessorAndMutatorDescriptor({}, 'test', {
                    name: 'test',
                    getter: true,
                    setter: true
                })).toBeUndefined();
            });
            it('returns the property descriptor by default if there is no accessor and mutator', function () {
                class Test {
                    get property() {
                        return 'test';
                    }
                }
                const propertyDescriptor = Object.getOwnPropertyDescriptor(Test.prototype, 'property');
                expect(recordManager.makeAccessorAndMutatorDescriptor(Test.prototype, 'property', {
                    name: 'property',
                    getter: true,
                    setter: false
                })).toEqual(propertyDescriptor);
            });
            it('adds a get function to propertyDescriptor which calls accessor if setting has accessor but no getter', function () {
                class Test {
                    getPropertyAttribute() {
                        return 'test';
                    }
                    set property(value) { }
                }
                const dynamicAttributeSetting = {
                    name: 'property',
                    getter: false,
                    setter: true,
                    accessor: 'getPropertyAttribute'
                };
                const propertyDescriptor = Object.getOwnPropertyDescriptor(Test.prototype, 'property');
                const descriptor = recordManager.makeAccessorAndMutatorDescriptor(Test.prototype, 'property', dynamicAttributeSetting);
                expect(descriptor).not.toEqual(propertyDescriptor);
                expect(typeof descriptor.get).toEqual('function');
                const instance = new Test();
                instance['sharedMetadata'] = { dynamicAttributes: { property: dynamicAttributeSetting } };
                expect(descriptor.get.call(instance)).toEqual('test');
            });
            it('adds a set function to propertyDescriptor which calls mutator if setting has mutator but no setter', function () {
                class Test {
                    setPropertyAttribute(value) {
                        this._property = 'test-' + value;
                    }
                    get property() {
                        return this._property;
                    }
                }
                const dynamicAttributeSetting = {
                    name: 'property',
                    getter: true,
                    setter: false,
                    mutator: 'setPropertyAttribute'
                };
                const propertyDescriptor = Object.getOwnPropertyDescriptor(Test.prototype, 'property');
                const descriptor = recordManager.makeAccessorAndMutatorDescriptor(Test.prototype, 'property', dynamicAttributeSetting);
                expect(descriptor).not.toEqual(propertyDescriptor);
                expect(typeof descriptor.set).toEqual('function');
                const instance = new Test();
                instance['sharedMetadata'] = { dynamicAttributes: { property: dynamicAttributeSetting } };
                descriptor.set.call(instance, 'anything');
                expect(instance.property).toEqual('test-anything');
            });
        });
    });
});
