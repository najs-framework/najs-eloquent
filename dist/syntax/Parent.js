"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const index_1 = require("../lib/index");
// Please note that base class is
//      Eloquent.Mongoose<IParentVirtualAttribute, Parent>()
// IParentVirtualAttribute: virtual attributes which often shared to client side
// Parent: we have to pass class name, otherwise instance and eloquent will get Type error in build time
exports.BaseClass = index_1.Eloquent.Mongoose();
class Parent extends exports.BaseClass {
    getClassName() {
        return Parent.className;
    }
    getSchema() {
        return new mongoose_1.Schema({});
    }
    get parent_getter() {
        return 'parent_getter';
    }
    set parent_setter(value) { }
    parentMethod() { }
    static parentStaticMethod() { }
}
Parent.className = 'Parent';
exports.Parent = Parent;
function test_syntax() {
    // Usage
    const instance = new Parent();
    instance.parentMethod();
    const value = instance.parent_getter;
    instance.parent_setter = 'value';
    instance.parent_virtual_attribute = new Date();
    use(value);
    Parent.parentStaticMethod();
    async function test_collection() {
        const value = await Parent.select().all();
        value.map(item => item.parent_virtual_attribute).toArray();
    }
    use(test_collection);
    async function test_eloquent() {
        const eloquent = (await Parent.select().all()).first();
        const value = eloquent.parent_getter;
        eloquent.parent_setter = 'value';
        const date = eloquent.parent_virtual_attribute;
        eloquent.save();
        use(value);
        use(date);
    }
    use(test_eloquent);
    function use(...any) { }
}
exports.test_syntax = test_syntax;
