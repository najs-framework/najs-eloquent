"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Parent_1 = require("./Parent");
exports.ChildBase = Parent_1.Parent.Class();
class Child extends exports.ChildBase {
    getClassName() {
        return Child.className;
    }
    getSchema() {
        return new mongoose_1.Schema({});
    }
    get child_getter() {
        return 'child_getter';
    }
    set child_setter(value) { }
    childMethod() { }
    static childStaticMethod() { }
}
Child.className = 'Child';
exports.Child = Child;
function test_syntax() {
    // Usage
    const instance = new Child();
    const value = instance.child_getter;
    instance.child_setter = 'value';
    const date = instance.child_virtual_attribute;
    instance.childMethod();
    use(value);
    use(date);
    const value_parent = instance.parent_getter;
    instance.parent_setter = 'value';
    const date_parent = instance.parent_virtual_attribute;
    instance.parentMethod();
    use(value_parent);
    use(date_parent);
    instance.save();
    Child.childStaticMethod();
    Parent_1.Parent.parentStaticMethod();
    // Child.parentStaticMethod() => Access parent static method is not type-safe
    async function test_collection() {
        const value_child = await Child.select().all();
        value_child.map(item => item.child_virtual_attribute).toArray();
        const value_parent = await Child.select().all();
        value_parent
            .map(function (item) {
            return item.parent_virtual_attribute;
        })
            .toArray();
    }
    use(test_collection);
    async function test_eloquent() {
        const eloquent = (await Child.select().all()).first();
        const value = eloquent.child_getter;
        eloquent.child_setter = 'value';
        const date = eloquent.child_virtual_attribute;
        eloquent.childMethod();
        use(value);
        use(date);
        const value_parent = eloquent.parent_getter;
        eloquent.parent_setter = 'value';
        const date_parent = eloquent.parent_virtual_attribute;
        eloquent.parentMethod();
        use(value_parent);
        use(date_parent);
        eloquent.save();
        const data = await Child.where('test', 1).get();
        data.reduce(function () { }).all();
        const result = await Child.find(1);
        result.parentMethod();
    }
    use(test_eloquent);
    function use(...any) { }
}
exports.test_syntax = test_syntax;
