"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const SerializationPublicApi_1 = require("../../../lib/features/mixin/SerializationPublicApi");
describe('SerializationPublicApi', function () {
    const serializationFeature = {
        getVisible() {
            return 'getVisible-result';
        },
        setVisible() {
            return 'setVisible-result';
        },
        makeVisible() {
            return 'makeVisible-result';
        },
        getHidden() {
            return 'getHidden-result';
        },
        setHidden() {
            return 'setHidden-result';
        },
        makeHidden() {
            return 'makeHidden-result';
        },
        addVisible() {
            return 'addVisible-result';
        },
        addHidden() {
            return 'addHidden-result';
        },
        isVisible() {
            return 'isVisible-result';
        },
        isHidden() {
            return 'isHidden-result';
        },
        attributesToObject() {
            return 'attributesToObject-result';
        },
        relationsToObject() {
            return 'relationsToObject-result';
        },
        toObject() {
            return 'toObject-result';
        },
        toJson() {
            return 'toJson-result';
        }
    };
    const model = {
        driver: {
            getSerializationFeature() {
                return serializationFeature;
            }
        }
    };
    describe('.getVisible()', function () {
        it('calls and returns SerializationFeature.getVisible()', function () {
            const stub = Sinon.stub(serializationFeature, 'getVisible');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.getVisible.call(model)).toEqual('anything');
            expect(stub.calledWith(model)).toBe(true);
            stub.restore();
        });
    });
    describe('.setVisible()', function () {
        it('calls and returns FillableFeature.setVisible()', function () {
            const stub = Sinon.stub(serializationFeature, 'setVisible');
            stub.returns('anything');
            const value = ['a', 'b'];
            expect(SerializationPublicApi_1.SerializationPublicApi.setVisible.call(model, value) === model).toBe(true);
            expect(stub.calledWith(model, value)).toBe(true);
            stub.restore();
        });
    });
    describe('.makeVisible()', function () {
        it('is chainable, calls SerializationFeature.makeVisible()', function () {
            const stub = Sinon.stub(serializationFeature, 'makeVisible');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.makeVisible.call(model, 'a', 'b') === model).toBe(true);
            expect(stub.calledWith(model)).toBe(true);
            expect(stub.lastCall.args[1][0]).toEqual('a');
            expect(stub.lastCall.args[1][1]).toEqual('b');
            stub.restore();
        });
    });
    describe('.getHidden()', function () {
        it('calls and returns SerializationFeature.getHidden()', function () {
            const stub = Sinon.stub(serializationFeature, 'getHidden');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.getHidden.call(model)).toEqual('anything');
            expect(stub.calledWith(model)).toBe(true);
            stub.restore();
        });
    });
    describe('.setHidden()', function () {
        it('calls and returns FillableFeature.setHidden()', function () {
            const stub = Sinon.stub(serializationFeature, 'setHidden');
            stub.returns('anything');
            const value = ['a', 'b'];
            expect(SerializationPublicApi_1.SerializationPublicApi.setHidden.call(model, value) === model).toBe(true);
            expect(stub.calledWith(model, value)).toBe(true);
            stub.restore();
        });
    });
    describe('.addVisible()', function () {
        it('is chainable, calls SerializationFeature.addVisible()', function () {
            const stub = Sinon.stub(serializationFeature, 'addVisible');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.addVisible.call(model, 'a', 'b') === model).toBe(true);
            expect(stub.calledWith(model)).toBe(true);
            expect(stub.lastCall.args[1][0]).toEqual('a');
            expect(stub.lastCall.args[1][1]).toEqual('b');
            stub.restore();
        });
    });
    describe('.addHidden()', function () {
        it('is chainable, calls SerializationFeature.addHidden()', function () {
            const stub = Sinon.stub(serializationFeature, 'addHidden');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.addHidden.call(model, 'a', 'b') === model).toBe(true);
            expect(stub.calledWith(model)).toBe(true);
            expect(stub.lastCall.args[1][0]).toEqual('a');
            expect(stub.lastCall.args[1][1]).toEqual('b');
            stub.restore();
        });
    });
    describe('.makeHidden()', function () {
        it('is chainable, calls SerializationFeature.makeHidden()', function () {
            const stub = Sinon.stub(serializationFeature, 'makeHidden');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.makeHidden.call(model, 'a', 'b') === model).toBe(true);
            expect(stub.calledWith(model)).toBe(true);
            expect(stub.lastCall.args[1][0]).toEqual('a');
            expect(stub.lastCall.args[1][1]).toEqual('b');
            stub.restore();
        });
    });
    describe('.isVisible()', function () {
        it('calls and returns SerializationFeature.isVisible()', function () {
            const stub = Sinon.stub(serializationFeature, 'isVisible');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.isVisible.call(model, 'a', 'b')).toEqual('anything');
            expect(stub.calledWith(model)).toBe(true);
            expect(stub.lastCall.args[1][0]).toEqual('a');
            expect(stub.lastCall.args[1][1]).toEqual('b');
            stub.restore();
        });
    });
    describe('.isHidden()', function () {
        it('calls and returns SerializationFeature.isHidden()', function () {
            const stub = Sinon.stub(serializationFeature, 'isHidden');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.isHidden.call(model, 'a', 'b')).toEqual('anything');
            expect(stub.calledWith(model)).toBe(true);
            expect(stub.lastCall.args[1][0]).toEqual('a');
            expect(stub.lastCall.args[1][1]).toEqual('b');
            stub.restore();
        });
    });
    describe('.attributesToObject()', function () {
        it('calls and returns SerializationFeature.attributesToObject()', function () {
            const stub = Sinon.stub(serializationFeature, 'attributesToObject');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.attributesToObject.call(model)).toEqual('anything');
            expect(stub.calledWith(model)).toBe(true);
            stub.restore();
        });
    });
    describe('.relationsToObject()', function () {
        it('calls and returns SerializationFeature.relationsToObject() with relations=undefined, format=true if there is no params', function () {
            const stub = Sinon.stub(serializationFeature, 'relationsToObject');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.relationsToObject.call(model)).toEqual('anything');
            expect(stub.calledWith(model, undefined, true)).toBe(true);
            stub.restore();
        });
        it('calls and returns SerializationFeature.relationsToObject() with relations=undefined, format=true/false if first param is boolean', function () {
            const stub = Sinon.stub(serializationFeature, 'relationsToObject');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.relationsToObject.call(model, true)).toEqual('anything');
            expect(stub.calledWith(model, undefined, true)).toBe(true);
            stub.resetHistory();
            expect(SerializationPublicApi_1.SerializationPublicApi.relationsToObject.call(model, false)).toEqual('anything');
            expect(stub.calledWith(model, undefined, false)).toBe(true);
            stub.restore();
        });
        it('calls and returns SerializationFeature.relationsToObject() with relations=[], format=true if first param is string or array', function () {
            const stub = Sinon.stub(serializationFeature, 'relationsToObject');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.relationsToObject.call(model, '')).toEqual('anything');
            expect(stub.calledWith(model, [''], true)).toBe(true);
            stub.resetHistory();
            expect(SerializationPublicApi_1.SerializationPublicApi.relationsToObject.call(model, [])).toEqual('anything');
            expect(stub.calledWith(model, [], true)).toBe(true);
            stub.restore();
        });
        it('calls and returns SerializationFeature.relationsToObject() with 3rd overridden form', function () {
            const stub = Sinon.stub(serializationFeature, 'relationsToObject');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.relationsToObject.call(model, true, 'a', 'b')).toEqual('anything');
            expect(stub.calledWith(model, ['a', 'b'], true)).toBe(true);
            stub.resetHistory();
            expect(SerializationPublicApi_1.SerializationPublicApi.relationsToObject.call(model, false, 'x', ['y'], 'z')).toEqual('anything');
            expect(stub.calledWith(model, ['x', 'y', 'z'], false)).toBe(true);
            stub.restore();
        });
    });
    describe('.toObject()', function () {
        it('calls and returns SerializationFeature.toObject()', function () {
            const stub = Sinon.stub(serializationFeature, 'toObject');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.toObject.call(model)).toEqual('anything');
            expect(stub.calledWith(model, undefined)).toBe(true);
            stub.resetHistory();
            const options = {};
            expect(SerializationPublicApi_1.SerializationPublicApi.toObject.call(model, options)).toEqual('anything');
            expect(stub.calledWith(model, options)).toBe(true);
            stub.restore();
        });
    });
    describe('.toJSON()', function () {
        it('calls and returns SerializationFeature.toObject()', function () {
            const stub = Sinon.stub(serializationFeature, 'toObject');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.toJSON.call(model)).toEqual('anything');
            expect(stub.calledWith(model, undefined)).toBe(true);
            stub.resetHistory();
            const options = {};
            expect(SerializationPublicApi_1.SerializationPublicApi.toJSON.call(model, options)).toEqual('anything');
            expect(stub.calledWith(model, options)).toBe(true);
            stub.restore();
        });
    });
    describe('.toJson()', function () {
        it('calls and returns SerializationFeature.toJson()', function () {
            const stub = Sinon.stub(serializationFeature, 'toJson');
            stub.returns('anything');
            expect(SerializationPublicApi_1.SerializationPublicApi.toJson.call(model, 1, 2)).toEqual('anything');
            expect(stub.calledWith(model, 1, 2)).toBe(true);
            stub.restore();
        });
    });
});
