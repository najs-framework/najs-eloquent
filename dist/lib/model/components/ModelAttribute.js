"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
class ModelAttribute {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelAttribute;
    }
    extend(prototype, bases, driver) {
        prototype['getAttribute'] = ModelAttribute.getAttribute;
        prototype['setAttribute'] = ModelAttribute.setAttribute;
        prototype['getPrimaryKey'] = ModelAttribute.getPrimaryKey;
        prototype['setPrimaryKey'] = ModelAttribute.setPrimaryKey;
        prototype['getPrimaryKeyName'] = ModelAttribute.getPrimaryKeyName;
    }
    static getAttribute(key) {
        return this['driver'].getAttribute(key);
    }
    static setAttribute(key, value) {
        this['driver'].setAttribute(key, value);
        return this;
    }
    static getPrimaryKey() {
        return this['driver'].getAttribute(this.getPrimaryKeyName());
    }
    static setPrimaryKey(id) {
        this['driver'].setAttribute(this.getPrimaryKeyName(), id);
        return this;
    }
    static getPrimaryKeyName() {
        return this['driver'].getPrimaryKeyName();
    }
}
ModelAttribute.className = constants_1.NajsEloquent.Model.Component.ModelAttribute;
exports.ModelAttribute = ModelAttribute;
najs_binding_1.register(ModelAttribute);
