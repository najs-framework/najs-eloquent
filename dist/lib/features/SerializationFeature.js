"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/relations/IRelationship.ts" />
/// <reference path="../definitions/features/ISerializationFeature.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const najs_binding_1 = require("najs-binding");
const FeatureBase_1 = require("./FeatureBase");
const SerializationPublicApi_1 = require("./mixin/SerializationPublicApi");
const constants_1 = require("../constants");
const helpers_1 = require("../util/helpers");
const functions_1 = require("../util/functions");
const DEFAULT_TO_OBJECT_OPTIONS = {
    relations: true,
    formatRelationName: true,
    applyVisibleAndHidden: true
};
class SerializationFeature extends FeatureBase_1.FeatureBase {
    getPublicApi() {
        return SerializationPublicApi_1.SerializationPublicApi;
    }
    getFeatureName() {
        return 'Serialization';
    }
    getClassName() {
        return constants_1.NajsEloquent.Feature.SerializationFeature;
    }
    getVisible(model) {
        const iModel = this.useInternalOf(model);
        if (typeof iModel.internalData.overridden !== 'undefined' && iModel.internalData.overridden.visible) {
            return model['visible'];
        }
        return this.useSettingFeatureOf(model).getArrayUniqueSetting(model, 'visible', []);
    }
    setVisible(model, visible) {
        functions_1.override_setting_property_of_model(model, 'visible', visible);
    }
    addVisible(model, keys) {
        return this.useSettingFeatureOf(model).pushToUniqueArraySetting(model, 'visible', keys);
    }
    makeVisible(model, keys) {
        const hidden = this.getHidden(model);
        if (hidden.length > 0) {
            const names = functions_1.array_unique(lodash_1.flatten(keys));
            this.setHidden(model, hidden.filter(function (item) {
                return names.indexOf(item) === -1;
            }));
        }
        const visible = this.getVisible(model);
        if (visible.length !== 0) {
            this.addVisible(model, keys);
            return;
        }
    }
    isVisible(model, keys) {
        return this.useSettingFeatureOf(model).isInWhiteList(model, keys, this.getVisible(model), this.getHidden(model));
    }
    getHidden(model) {
        const iModel = this.useInternalOf(model);
        if (typeof iModel.internalData.overridden !== 'undefined' && iModel.internalData.overridden.hidden) {
            return model['hidden'];
        }
        return this.useSettingFeatureOf(model).getArrayUniqueSetting(model, 'hidden', []);
    }
    setHidden(model, hidden) {
        functions_1.override_setting_property_of_model(model, 'hidden', hidden);
    }
    addHidden(model, keys) {
        return this.useSettingFeatureOf(model).pushToUniqueArraySetting(model, 'hidden', keys);
    }
    makeHidden(model, keys) {
        const visible = this.getVisible(model);
        if (visible.length > 0) {
            const names = functions_1.array_unique(lodash_1.flatten(keys));
            this.setVisible(model, visible.filter(function (item) {
                return names.indexOf(item) === -1;
            }));
        }
        this.addHidden(model, keys);
    }
    isHidden(model, keys) {
        return this.useSettingFeatureOf(model).isInBlackList(model, keys, this.getHidden(model));
    }
    attributesToObject(model, shouldApplyVisibleAndHidden = true) {
        const data = this.useRecordManagerOf(model).toObject(model);
        return shouldApplyVisibleAndHidden ? this.applyVisibleAndHiddenFor(model, data) : data;
    }
    relationDataToObject(model, data, chains, relationName, formatName) {
        if (helpers_1.isModel(data)) {
            return this.useSerializationFeatureOf(data).toObject(data, {
                relations: chains,
                formatRelationName: formatName
            });
        }
        if (helpers_1.isCollection(data)) {
            return data
                .map((nextModel) => {
                return this.useSerializationFeatureOf(nextModel).toObject(nextModel, {
                    relations: chains,
                    formatRelationName: formatName
                });
            })
                .all();
        }
        return this.useRelationFeatureOf(model).getEmptyValueForSerializedRelation(model, relationName);
    }
    relationsToObject(model, names, formatName, shouldApplyVisibleAndHidden = true) {
        const relations = typeof names === 'undefined' ? model.getLoadedRelations() : model.getRelations(names);
        const data = relations.reduce((memo, relation) => {
            const relationName = relation.getName();
            const name = formatName ? model.formatAttributeName(relationName) : relationName;
            memo[name] = this.relationDataToObject(model, relation.getData(), relation.getChains(), relationName, formatName);
            return memo;
        }, {});
        return shouldApplyVisibleAndHidden ? this.applyVisibleAndHiddenFor(model, data) : data;
    }
    applyVisibleAndHiddenFor(model, data) {
        const visible = this.getVisible(model), hidden = this.getHidden(model);
        const settingFeature = this.useSettingFeatureOf(model);
        return Object.getOwnPropertyNames(data).reduce((memo, name) => {
            if (settingFeature.isKeyInWhiteList(model, name, visible, hidden)) {
                memo[name] = data[name];
            }
            return memo;
        }, {});
    }
    toObject(model, options) {
        const opts = Object.assign({}, DEFAULT_TO_OBJECT_OPTIONS, options);
        let relationData = {};
        if (opts.relations === true || typeof opts.relations === 'undefined') {
            relationData = this.relationsToObject(model, undefined, !!opts.formatRelationName, false);
        }
        if (Array.isArray(opts.relations)) {
            relationData = this.relationsToObject(model, opts.relations, !!opts.formatRelationName, false);
        }
        const data = Object.assign({}, this.attributesToObject(model, false), relationData);
        if (typeof opts.hidden !== 'undefined' && opts.hidden.length > 0) {
            this.makeHidden(model, opts.hidden);
        }
        if (typeof opts.visible !== 'undefined' && opts.visible.length > 0) {
            this.makeVisible(model, opts.visible);
        }
        return opts.applyVisibleAndHidden ? this.applyVisibleAndHiddenFor(model, data) : data;
    }
    toJson(model, replacer, space) {
        return JSON.stringify(model, replacer, space);
    }
}
exports.SerializationFeature = SerializationFeature;
najs_binding_1.register(SerializationFeature, 'NajsEloquent.Feature.SerializationFeature');
