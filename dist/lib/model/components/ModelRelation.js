"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
// import { flatten } from 'lodash'
// function find_relations_in_prototype(prototype: Object, relations: Object) {}
// export function findRelationsForModel(model: NajsEloquent.Model.IModel<any>) {
//   const relations = {}
//   find_relations_in_prototype(Object.getPrototypeOf(model), relations)
// }
class ModelRelation {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelRelation;
    }
    extend(prototype, bases, driver) {
        prototype['load'] = ModelRelation.load;
        prototype['getRelationByName'] = ModelRelation.getRelationByName;
        prototype['defineRelationProperty'] = ModelRelation.defineRelationProperty;
    }
    static callMappedRelationByName(model, name) {
        if (typeof model['relations'] === 'undefined' || typeof model['relations'][name] === 'undefined') {
            throw new Error(`Relation "${name}" is not found in model "${model.getModelName()}".`);
        }
        const mapping = model['relations'][name];
        if (mapping.type === 'getter') {
            return model[mapping.mapTo];
        }
        return model[mapping.mapTo].call(model);
    }
}
ModelRelation.className = constants_1.NajsEloquent.Model.Component.ModelRelation;
ModelRelation.load = async function () {
    console.warn('Relation feature is not available until v0.4.0');
    // const relations: string[] = flatten(arguments)
    // for (const relationName of relations) {
    //   this.getRelationByName(relationName).lazyLoad(this)
    // }
    // return this
};
ModelRelation.getRelationByName = function (name) {
    console.warn('Relation feature is not available until v0.4.0');
    // const relationNames = name.split('.')
    // for (const relationName of relationNames) {
    //   return this[relationName]
    // }
    return ModelRelation.callMappedRelationByName(this, name);
};
ModelRelation.defineRelationProperty = async function (name) {
    console.warn('Relation feature is not available until v0.4.0');
    if (this['__sample']) {
        this['relationName'] = name;
    }
    // TODO: always returns RelationFactory
};
exports.ModelRelation = ModelRelation;
najs_binding_1.register(ModelRelation);
