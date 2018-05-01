"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
class ModelSerialization {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelSerialization;
    }
    extend(prototype, bases, driver) {
        prototype['getVisible'] = ModelSerialization.getVisible;
        prototype['getHidden'] = ModelSerialization.getHidden;
        prototype['markVisible'] = ModelSerialization.markVisible;
        prototype['markHidden'] = ModelSerialization.markHidden;
        prototype['isVisible'] = ModelSerialization.isVisible;
        prototype['isHidden'] = ModelSerialization.isHidden;
        prototype['toObject'] = ModelSerialization.toObject;
        prototype['toJSON'] = ModelSerialization.toJSON;
        prototype['toJson'] = ModelSerialization.toJSON;
    }
}
ModelSerialization.className = constants_1.NajsEloquent.Model.Component.ModelSerialization;
ModelSerialization.getVisible = function () {
    return this.getArrayUniqueSetting('visible', []);
};
ModelSerialization.getHidden = function () {
    return this.getArrayUniqueSetting('hidden', []);
};
ModelSerialization.markVisible = function () {
    return this.pushToUniqueArraySetting('visible', arguments);
};
ModelSerialization.markHidden = function () {
    return this.pushToUniqueArraySetting('hidden', arguments);
};
ModelSerialization.isVisible = function () {
    return this.isInWhiteList(arguments, this.getVisible(), this.getHidden());
};
ModelSerialization.isHidden = function () {
    return this.isInBlackList(arguments, this.getHidden());
};
ModelSerialization.toObject = function () {
    return this['driver'].toObject();
};
ModelSerialization.toJSON = function () {
    const data = this.toObject(), visible = this.getVisible(), hidden = this.getHidden();
    return Object.getOwnPropertyNames(data).reduce((memo, name) => {
        if (this.isKeyInWhiteList(name, visible, hidden)) {
            memo[name] = data[name];
        }
        return memo;
    }, {});
};
exports.ModelSerialization = ModelSerialization;
najs_binding_1.register(ModelSerialization);
