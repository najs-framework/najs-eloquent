"use strict";
/// <reference path="interfaces/IModel.ts" />
/// <reference path="interfaces/IModelQuery.ts" />
/// <reference path="interfaces/static/IMongooseStatic.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const Model_1 = require("./Model");
const ClassSetting_1 = require("../util/ClassSetting");
const DynamicAttribute_1 = require("./components/DynamicAttribute");
const ModelQuery_1 = require("./components/ModelQuery");
const StaticQuery_1 = require("./components/StaticQuery");
const EloquentProxy_1 = require("./EloquentProxy");
const EloquentComponentProviderFacade_1 = require("../facades/global/EloquentComponentProviderFacade");
class Eloquent extends Model_1.Model {
    /**
     * Model constructor.
     *
     * @param {Object|undefined} data
     */
    constructor(data, isGuarded = true) {
        super(data, isGuarded);
        if (data !== ClassSetting_1.CREATE_SAMPLE) {
            EloquentComponentProviderFacade_1.EloquentComponentProvider.extend(this, this.driver);
            if (this.driver.useEloquentProxy()) {
                return new Proxy(this, EloquentProxy_1.EloquentProxy);
            }
        }
    }
    /**
     * Register given model.
     *
     * @param {Eloquent} model
     */
    static register(model) {
        najs_binding_1.register(model);
        Reflect.construct(model, []);
    }
    static Mongoose() {
        return Eloquent;
    }
    static Class() {
        return Eloquent;
    }
}
exports.Eloquent = Eloquent;
const defaultComponents = [najs_binding_1.make(ModelQuery_1.ModelQuery.className), najs_binding_1.make(StaticQuery_1.StaticQuery.className)];
for (const component of defaultComponents) {
    component.extend(Eloquent.prototype, [], {});
}
EloquentComponentProviderFacade_1.EloquentComponentProvider.register(DynamicAttribute_1.DynamicAttribute, 'dynamic-attribute', true);
