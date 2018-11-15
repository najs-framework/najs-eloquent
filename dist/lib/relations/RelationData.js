"use strict";
/// <reference path="../definitions/relations/IRelationData.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class RelationData {
    constructor(factory) {
        this.factory = factory;
        this.state = 'unload';
    }
    getFactory() {
        return this.factory;
    }
    isLoaded() {
        return this.state === 'loaded' || this.state === 'collected';
    }
    hasData() {
        return this.state === 'collected';
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
        this.state = 'collected';
        return data;
    }
    getLoadType() {
        return this.loadType || 'unknown';
    }
    setLoadType(type) {
        this.loadType = type;
        this.state = 'loaded';
        return this;
    }
}
exports.RelationData = RelationData;
