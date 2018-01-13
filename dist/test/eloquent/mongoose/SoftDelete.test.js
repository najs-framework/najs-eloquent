"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const util_1 = require("../../util");
const mongoose_1 = require("mongoose");
const SoftDelete_1 = require("../../../lib/eloquent/mongoose/SoftDelete");
const Moment = require('moment');
const mongoose = require('mongoose');
let count = 0;
function create_model(options) {
    const schema = new mongoose_1.Schema({
        name: String
    }, { collection: 'soft_deletes_' + count });
    schema.plugin(SoftDelete_1.SoftDelete, options);
    count++;
    return mongoose_1.model('SoftDelete' + count, schema);
}
function make_deletedAt_tests(Model, fieldName) {
    it('always add deleted_at = null when document is created', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const document = new Model({
                name: 'test'
            });
            yield document.save();
            expect(document[fieldName]).toBeNull();
        });
    });
    it('defines new method called `delete()` and updates deleted_at = now', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date(1988, 4, 16);
            Moment.now = () => now;
            const document = yield Model.findOne({ name: 'test' });
            yield document.delete();
            expect(document[fieldName]).toEqual(now);
        });
    });
    it('defines new method called `restore()` and updates deleted_at = null', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date(2000, 0, 1);
            Moment.now = () => now;
            const document = yield Model.findOne({ name: 'test' });
            yield document.restore();
            expect(document[fieldName]).toBeNull();
        });
    });
}
function make_count_overridden_test(Model, isOverridden) {
    it('override count()', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const notDeleted = yield new Model({ name: 'test' }).save();
            const deleted = yield new Model({ name: 'test' });
            yield deleted.delete();
            if (isOverridden) {
                expect(yield Model.count({ name: 'test' })).toEqual(1);
                expect(yield Model.countOnlyDeleted({ name: 'test' })).toEqual(1);
                expect(yield Model.countWithDeleted({ name: 'test' })).toEqual(2);
            }
            else {
                expect(yield Model.count({ name: 'test' })).toEqual(2);
                expect(Model.countOnlyDeleted).toBeUndefined();
                expect(Model.countWithDeleted).toBeUndefined();
            }
            yield notDeleted.remove();
            yield deleted.remove();
        });
    });
}
function make_findOne_overridden_test(Model, isOverridden) {
    it('override fineOne()', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const notDeleted = new Model({ name: 'test' });
            yield notDeleted.save();
            const deleted = yield new Model({ name: 'test' });
            yield deleted.delete();
            if (isOverridden) {
                expect((yield Model.findOne({ name: 'test' })).toObject()).toEqual(notDeleted.toObject());
                expect((yield Model.findOneOnlyDeleted({ name: 'test' })).toObject()).toEqual(deleted.toObject());
                expect((yield Model.findOneWithDeleted({ name: 'test' })).toObject()).toEqual(notDeleted.toObject());
            }
            else {
                expect((yield Model.findOne({ name: 'test' })).toObject()).toEqual(notDeleted.toObject());
                expect(Model.findOneOnlyDeleted).toBeUndefined();
                expect(Model.findOneWithDeleted).toBeUndefined();
            }
            yield notDeleted.remove();
            yield deleted.remove();
        });
    });
}
function make_find_overridden_test(Model, isOverridden) {
    it('override fine()', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const notDeleted = new Model({ name: 'test' });
            yield notDeleted.save();
            const deleted = yield new Model({ name: 'test' });
            yield deleted.delete();
            if (isOverridden) {
                expect((yield Model.find({ name: 'test' })).map((item) => item.toObject())).toEqual([notDeleted.toObject()]);
                expect((yield Model.findOnlyDeleted({ name: 'test' })).map((item) => item.toObject())).toEqual([
                    deleted.toObject()
                ]);
                expect((yield Model.findWithDeleted({ name: 'test' })).map((item) => item.toObject())).toEqual([
                    notDeleted.toObject(),
                    deleted.toObject()
                ]);
            }
            else {
                expect((yield Model.find({ name: 'test' })).map((item) => item.toObject())).toEqual([
                    notDeleted.toObject(),
                    deleted.toObject()
                ]);
                expect(Model.findOnlyDeleted).toBeUndefined();
                expect(Model.findWithDeleted).toBeUndefined();
            }
            yield notDeleted.remove();
            yield deleted.remove();
        });
    });
}
describe('SoftDelete', function () {
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield util_1.init_mongoose(mongoose);
        });
    });
    afterAll(function () {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < count; i++) {
                yield util_1.delete_collection(mongoose, 'soft_deletes_' + i);
            }
        });
    });
    describe('Default Options', function () {
        make_deletedAt_tests(create_model(), 'deleted_at');
    });
    describe('options .deletedAt', function () {
        make_deletedAt_tests(create_model({ deletedAt: 'deletedAt' }), 'deletedAt');
        make_deletedAt_tests(create_model({ deletedAt: 'any' }), 'any');
    });
    describe('options overrideMethods', function () {
        describe('overrideMethods = false', function () {
            const Model = create_model({ overrideMethods: false });
            make_count_overridden_test(Model, false);
            make_findOne_overridden_test(Model, false);
            make_find_overridden_test(Model, false);
        });
        describe('overrideMethods = true', function () {
            const Model = create_model({ overrideMethods: true });
            make_count_overridden_test(Model, true);
            make_findOne_overridden_test(Model, true);
            make_find_overridden_test(Model, true);
        });
        describe('overrideMethods = "all"', function () {
            const Model = create_model({ overrideMethods: 'all' });
            make_count_overridden_test(Model, true);
            make_findOne_overridden_test(Model, true);
            make_find_overridden_test(Model, true);
        });
        describe('overrideMethods = ["count", "find"]', function () {
            const Model = create_model({ overrideMethods: ['count', 'find'] });
            make_count_overridden_test(Model, true);
            make_findOne_overridden_test(Model, false);
            make_find_overridden_test(Model, true);
        });
        describe('overrideMethods = ["not_found", "find"]', function () {
            const Model = create_model({ overrideMethods: ['not_found', 'find'] });
            make_count_overridden_test(Model, false);
            make_findOne_overridden_test(Model, false);
            make_find_overridden_test(Model, true);
        });
    });
});
