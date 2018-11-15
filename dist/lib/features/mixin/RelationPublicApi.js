"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/model/IModelRelation.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const RelationUtilities_1 = require("../../relations/RelationUtilities");
exports.RelationPublicApi = {
    getRelation(name) {
        return this.driver.getRelationFeature().findByName(this, name);
    },
    getRelations(...args) {
        const relationNames = lodash_1.flatten(arguments);
        return RelationUtilities_1.RelationUtilities.bundleRelations(relationNames.map(name => this.getRelation(name)));
    },
    getLoadedRelations() {
        return this.driver.getRelationFeature().getLoadedRelations(this);
    },
    defineRelation(name) {
        return this.driver
            .getRelationFeature()
            .findDataByName(this, name)
            .getFactory();
    },
    load(...args) {
        const relationNames = lodash_1.flatten(arguments);
        return Promise.all(relationNames.map(name => {
            return this.getRelation(name).load();
        }));
    },
    isLoaded(relation) {
        return this.driver.getRelationFeature().isLoadedRelation(this, relation);
    },
    getLoaded() {
        return this.getLoadedRelations().map(item => item.getName());
    }
};
