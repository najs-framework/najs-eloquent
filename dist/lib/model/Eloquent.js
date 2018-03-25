"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const EloquentMetadata_1 = require("./EloquentMetadata");
const EloquentDriverProviderFacade_1 = require("../facades/global/EloquentDriverProviderFacade");
const EloquentProxy_1 = require("./EloquentProxy");
const lodash_1 = require("lodash");
const collect_js_1 = require("collect.js");
/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
class Eloquent {
    constructor(data, isGuarded = true) {
        this.driver = EloquentDriverProviderFacade_1.EloquentDriverProvider.create(this, isGuarded);
        if (!najs_binding_1.ClassRegistry.has(this.getClassName())) {
            najs_binding_1.register(Object.getPrototypeOf(this).constructor, this.getClassName(), false);
        }
        if (data !== 'do-not-initialize') {
            this.driver.initialize(data);
            this.attributes = this.driver.getRecord();
            return new Proxy(this, EloquentProxy_1.EloquentProxy);
        }
    }
    getModelName() {
        return this.getClassName();
    }
    getAttribute(name) {
        return this.driver.getAttribute(name);
    }
    setAttribute(name, value) {
        return this.driver.setAttribute(name, value);
    }
    toObject() {
        return this.driver.toObject();
    }
    toJSON() {
        return this.driver.toJSON();
    }
    toJson() {
        return this.driver.toJSON();
    }
    fill(data) {
        const fillable = this.getFillable();
        const fillableAttributes = fillable.length > 0 ? lodash_1.pick(data, fillable) : data;
        for (const key in fillableAttributes) {
            if (this.isFillable(key)) {
                this.setAttribute(key, fillableAttributes[key]);
            }
        }
        return this;
    }
    forceFill(data) {
        for (const key in data) {
            this.setAttribute(key, data[key]);
        }
        return this;
    }
    getFillable() {
        return this.mergeWithTemporarySetting('fillable', EloquentMetadata_1.EloquentMetadata.get(this).fillable());
    }
    getGuarded() {
        return this.mergeWithTemporarySetting('guarded', EloquentMetadata_1.EloquentMetadata.get(this).guarded());
    }
    isFillable(key) {
        return this.isInWhiteList(key, this.getFillable(), this.getGuarded());
    }
    isGuarded(key) {
        return this.isInBlackList(key, this.getGuarded());
    }
    getVisible() {
        return this.mergeWithTemporarySetting('visible', EloquentMetadata_1.EloquentMetadata.get(this).visible());
    }
    getHidden() {
        return this.mergeWithTemporarySetting('hidden', EloquentMetadata_1.EloquentMetadata.get(this).hidden());
    }
    isVisible(key) {
        return this.isInWhiteList(key, this.getVisible(), this.getHidden());
    }
    isHidden(key) {
        return this.isInBlackList(key, this.getHidden());
    }
    isInWhiteList(key, whiteList, blackList) {
        if (whiteList.length > 0 && whiteList.indexOf(key) !== -1) {
            return true;
        }
        if (this.isInBlackList(key, blackList)) {
            return false;
        }
        return whiteList.length === 0 && !EloquentMetadata_1.EloquentMetadata.get(this).hasAttribute(key) && key.indexOf('_') !== 0;
    }
    isInBlackList(key, blackList) {
        return (blackList.length === 1 && blackList[0] === '*') || blackList.indexOf(key) !== -1;
    }
    mergeWithTemporarySetting(name, value) {
        if (!this.temporarySettings || !this.temporarySettings[name]) {
            return value;
        }
        return Array.from(new Set(value.concat(this.temporarySettings[name])));
    }
    concatTemporarySetting(name, value) {
        if (!this.temporarySettings) {
            this.temporarySettings = {};
        }
        if (!this.temporarySettings[name]) {
            this.temporarySettings[name] = [];
        }
        this.temporarySettings[name] = Array.from(new Set(this.temporarySettings[name].concat(value)));
        return this;
    }
    markFillable(...args) {
        return this.concatTemporarySetting('fillable', lodash_1.flatten(args));
    }
    markGuarded(...args) {
        return this.concatTemporarySetting('guarded', lodash_1.flatten(args));
    }
    markVisible(...args) {
        return this.concatTemporarySetting('visible', lodash_1.flatten(args));
    }
    markHidden(...args) {
        return this.concatTemporarySetting('hidden', lodash_1.flatten(args));
    }
    newInstance(data) {
        return najs_binding_1.make(this.getClassName(), [data]);
    }
    newCollection(dataset) {
        return collect_js_1.default(dataset.map(item => this.newInstance(item)));
    }
    getReservedNames() {
        return [
            'inspect',
            'valueOf',
            'attributes',
            'driver',
            'fillable',
            'guarded',
            'visible',
            'hidden',
            'temporarySettings',
            'softDeletes',
            'timestamps',
            'table',
            'collection',
            'schema',
            'options'
        ].concat(this.driver.getReservedNames());
    }
}
exports.Eloquent = Eloquent;
