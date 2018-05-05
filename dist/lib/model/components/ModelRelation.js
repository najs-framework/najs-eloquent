"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
// import { flatten } from 'lodash'
class ModelRelation {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelSerialization;
    }
    extend(prototype, bases, driver) {
        prototype['load'] = ModelRelation.load;
    }
}
ModelRelation.className = constants_1.NajsEloquent.Model.Component.ModelRelation;
ModelRelation.load = async function () {
    // const relations: string[] = flatten(arguments)
    // for (const relationName of relations) {
    //   this.getRelationByName(relationName).lazyLoad(this)
    // }
    // return this
};
ModelRelation.getRelationByName = async function (name) {
    // const relationNames = name.split('.')
    // for (const relationName of relationNames) {
    //   return this[relationName]
    // }
};
exports.ModelRelation = ModelRelation;
najs_binding_1.register(ModelRelation);
