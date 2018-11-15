"use strict";
/// <reference path="../definitions/model/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
function relationFeatureOf(model) {
    return model.getDriver().getRelationFeature();
}
exports.relationFeatureOf = relationFeatureOf;
