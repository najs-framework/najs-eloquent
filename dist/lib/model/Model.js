"use strict";
/// <reference path="interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const ClassSetting_1 = require("../util/ClassSetting");
const najs_binding_2 = require("najs-binding");
const EloquentDriverProviderFacade_1 = require("../facades/global/EloquentDriverProviderFacade");
const ModelSetting_1 = require("./components/ModelSetting");
const ModelAttribute_1 = require("./components/ModelAttribute");
const ModelFillable_1 = require("./components/ModelFillable");
const ModelSerialization_1 = require("./components/ModelSerialization");
const ModelActiveRecord_1 = require("./components/ModelActiveRecord");
const ModelTimestamps_1 = require("./components/ModelTimestamps");
const ModelSoftDeletes_1 = require("./components/ModelSoftDeletes");
const ModelEvent_1 = require("./components/ModelEvent");
const Event_1 = require("./Event");
const collect = require('collect.js');
class Model {
    /**
     * Model constructor.
     *
     * @param {Object|undefined} data
     * @param {boolean|undefined} isGuarded
     */
    constructor(data, isGuarded = true) {
        const className = najs_binding_2.getClassName(this);
        if (!najs_binding_2.ClassRegistry.has(className)) {
            najs_binding_2.register(Object.getPrototypeOf(this).constructor, className);
        }
        if (data !== ClassSetting_1.CREATE_SAMPLE) {
            this.driver = EloquentDriverProviderFacade_1.EloquentDriverProvider.create(this);
            this.driver.initialize(this, isGuarded, data);
            this.attributes = this.driver.getRecord();
        }
    }
    getDriver() {
        return this.driver;
    }
    getModelName() {
        return najs_binding_2.getClassName(this);
    }
    getRecordName() {
        return this.driver.getRecordName();
    }
    is(model) {
        return this === model || this.getPrimaryKey().toString() === model.getPrimaryKey().toString();
    }
    newCollection(dataset) {
        return collect(dataset.map(item => this.newInstance(item)));
    }
    newInstance(data) {
        return najs_binding_1.make(najs_binding_2.getClassName(this), [data]);
    }
}
Model.Events = {
    Creating: Event_1.Event.Creating,
    Created: Event_1.Event.Created,
    Saving: Event_1.Event.Saving,
    Saved: Event_1.Event.Saved,
    Updating: Event_1.Event.Updating,
    Updated: Event_1.Event.Updated,
    Deleting: Event_1.Event.Deleting,
    Deleted: Event_1.Event.Deleted,
    Restoring: Event_1.Event.Restoring,
    Restored: Event_1.Event.Restored
};
exports.Model = Model;
const defaultComponents = [
    najs_binding_1.make(ModelSetting_1.ModelSetting.className),
    najs_binding_1.make(ModelAttribute_1.ModelAttribute.className),
    najs_binding_1.make(ModelFillable_1.ModelFillable.className),
    najs_binding_1.make(ModelSerialization_1.ModelSerialization.className),
    najs_binding_1.make(ModelActiveRecord_1.ModelActiveRecord.className),
    najs_binding_1.make(ModelTimestamps_1.ModelTimestamps.className),
    najs_binding_1.make(ModelSoftDeletes_1.ModelSoftDeletes.className),
    najs_binding_1.make(ModelEvent_1.ModelEvent.className)
];
for (const component of defaultComponents) {
    component.extend(Model.prototype, [], {});
}
